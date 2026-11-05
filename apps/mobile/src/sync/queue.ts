/**
 * Offline mutation queue (pure TS, storage-agnostic so it is unit-testable; Sprint 4 backs it with
 * expo-sqlite). Every mutation carries a client-generated id and an Idempotency-Key, so replays
 * after a lost response are safe (the API stores processed keys in idempotency_record).
 *
 * Conflict strategy (docs/prd/14-offline-sync.md): job status is server-authoritative — a 409 marks
 * the item "needs attention" and stops retrying; checklist answers are last-writer-wins per item.
 */

export interface QueuedMutation {
  id: string;
  idempotencyKey: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  attempts: number;
  nextAttemptAt: number;
  status: 'pending' | 'needs_attention' | 'done';
  lastError?: string;
}

export interface QueueStorage {
  load(): Promise<QueuedMutation[]>;
  save(items: QueuedMutation[]): Promise<void>;
}

export type Sender = (m: QueuedMutation) => Promise<{ status: number }>;

const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 5 * 60_000;

/** Exponential backoff with full jitter, capped at 5 minutes. */
export function backoffDelay(attempts: number, random: () => number = Math.random): number {
  const ceiling = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempts);
  return Math.floor(random() * ceiling);
}

export class SyncQueue {
  constructor(
    private readonly storage: QueueStorage,
    private readonly newId: () => string,
    private readonly now: () => number = Date.now,
  ) {}

  async enqueue(m: Pick<QueuedMutation, 'method' | 'path' | 'body'>): Promise<QueuedMutation> {
    const items = await this.storage.load();
    const id = this.newId();
    const item: QueuedMutation = {
      ...m,
      id,
      idempotencyKey: id,
      attempts: 0,
      nextAttemptAt: this.now(),
      status: 'pending',
    };
    await this.storage.save([...items, item]);
    return item;
  }

  /** Sends due items in FIFO order. Returns how many completed. */
  async flush(send: Sender): Promise<number> {
    const items = await this.storage.load();
    let done = 0;
    for (const item of items) {
      if (item.status !== 'pending' || item.nextAttemptAt > this.now()) continue;
      try {
        const { status } = await send(item);
        if (status >= 200 && status < 300) {
          item.status = 'done';
          done++;
        } else if (status === 409 || status === 422 || status === 404 || status === 403) {
          item.status = 'needs_attention';
          item.lastError = `HTTP ${status}`;
        } else {
          this.scheduleRetry(item, `HTTP ${status}`);
        }
      } catch (e) {
        this.scheduleRetry(item, e instanceof Error ? e.message : 'network error');
        // Offline: stop this round, keep order for the next flush.
        break;
      }
    }
    await this.storage.save(items.filter((i) => i.status !== 'done'));
    return done;
  }

  private scheduleRetry(item: QueuedMutation, error: string) {
    item.attempts += 1;
    item.lastError = error;
    item.nextAttemptAt = this.now() + backoffDelay(item.attempts);
  }
}
