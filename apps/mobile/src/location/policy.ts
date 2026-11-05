// SECURITY-REVIEW-REQUIRED / DPO sign-off: location tracking gate (docs/11-compliance.md §3).
/**
 * Pure decision function: may the app collect a location point right now? ALL must hold:
 * consent granted (and not revoked), current time inside the worker's working hours
 * (Europe/London), and an active job in en_route / on_site. The API re-checks server-side.
 */

export interface WorkingHours {
  /** ISO day of week 1 = Monday … 7 = Sunday */
  dayOfWeek: number;
  startsAt: string; // "08:00"
  endsAt: string; // "17:00"
}

export interface TrackingInputs {
  consentGranted: boolean;
  workingHours: WorkingHours[];
  activeJobStatus: string | null;
  now: Date;
}

const TRACKABLE_STATUSES = new Set(['en_route', 'on_site']);

/** Day of week and minutes since midnight in Europe/London (handles BST/GMT). */
export function londonClock(now: Date): { dayOfWeek: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    dayOfWeek: days.indexOf(get('weekday')) + 1,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

export function isWithinWorkingHours(hours: WorkingHours[], now: Date): boolean {
  const { dayOfWeek, minutes } = londonClock(now);
  return hours.some(
    (h) =>
      h.dayOfWeek === dayOfWeek &&
      minutes >= toMinutes(h.startsAt) &&
      minutes < toMinutes(h.endsAt),
  );
}

export function shouldTrack(input: TrackingInputs): boolean {
  return (
    input.consentGranted &&
    input.activeJobStatus !== null &&
    TRACKABLE_STATUSES.has(input.activeJobStatus) &&
    isWithinWorkingHours(input.workingHours, input.now)
  );
}
