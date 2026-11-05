import { describe, expect, it } from 'vitest';
import { backoffDelay, SyncQueue, type QueuedMutation, type QueueStorage } from '../src/sync/queue';

function memoryStorage(): QueueStorage & { items: QueuedMutation[] } {
  const s = {
    items: [] as QueuedMutation[],
    load: async () => structuredClone(s.items),
    save: async (items: QueuedMutation[]) => {
      s.items = structuredClone(items);
    },
  };
  return s;
}

describe('SyncQueue', () => {
  let n = 0;
  const ids = () => `id-${++n}`;

  it('uses the client id as the idempotency key and removes sent items', async () => {
    const storage = memoryStorage();
    const q = new SyncQueue(storage, ids, () => 0);
    const m = await q.enqueue({ method: 'PUT', path: '/v1/fieldwork/jobs/j1/checklist', body: [] });
    expect(m.idempotencyKey).toBe(m.id);
    const sent: string[] = [];
    expect(await q.flush(async (x) => (sent.push(x.idempotencyKey), { status: 204 }))).toBe(1);
    expect(sent).toEqual([m.id]);
    expect(storage.items).toHaveLength(0);
  });

  it('marks server-rejected (409) items as needing attention without retrying', async () => {
    const storage = memoryStorage();
    const q = new SyncQueue(storage, ids, () => 0);
    await q.enqueue({ method: 'POST', path: '/v1/jobs/j1/transitions' });
    await q.flush(async () => ({ status: 409 }));
    expect(storage.items[0]?.status).toBe('needs_attention');
  });

  it('stops on network failure, keeps order and schedules a retry', async () => {
    const storage = memoryStorage();
    let now = 0;
    const q = new SyncQueue(storage, ids, () => now);
    await q.enqueue({ method: 'POST', path: '/a' });
    await q.enqueue({ method: 'POST', path: '/b' });
    const calls: string[] = [];
    await q.flush(async (m) => {
      calls.push(m.path);
      throw new Error('offline');
    });
    expect(calls).toEqual(['/a']);
    expect(storage.items[0]?.attempts).toBe(1);
    now = 10 * 60_000;
    await q.flush(async () => ({ status: 200 }));
    expect(storage.items).toHaveLength(0);
  });

  it('backoff is capped at 5 minutes', () => {
    expect(backoffDelay(30, () => 0.999)).toBeLessThan(5 * 60_000);
    expect(backoffDelay(0, () => 0.5)).toBe(500);
  });
});
