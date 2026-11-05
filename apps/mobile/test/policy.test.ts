import { describe, expect, it } from 'vitest';
import { isWithinWorkingHours, londonClock, shouldTrack } from '../src/location/policy';

const monday9to5 = [{ dayOfWeek: 1, startsAt: '08:00', endsAt: '17:00' }];
// 2026-11-09 is a Monday; November = GMT (UTC+0)
const mondayAt = (utc: string) => new Date(`2026-11-09T${utc}Z`);

describe('location tracking policy (DRAFT, DPO sign-off required)', () => {
  it('tracks only with consent, working hours and an active job', () => {
    const base = {
      consentGranted: true,
      workingHours: monday9to5,
      activeJobStatus: 'en_route',
      now: mondayAt('10:00:00'),
    };
    expect(shouldTrack(base)).toBe(true);
    expect(shouldTrack({ ...base, consentGranted: false })).toBe(false);
    expect(shouldTrack({ ...base, activeJobStatus: null })).toBe(false);
    expect(shouldTrack({ ...base, activeJobStatus: 'completed' })).toBe(false);
    expect(shouldTrack({ ...base, now: mondayAt('17:01:00') })).toBe(false);
    expect(shouldTrack({ ...base, now: new Date('2026-11-08T10:00:00Z') })).toBe(false); // Sunday
  });

  it('uses Europe/London time across BST', () => {
    // 2026-07-06 is a Monday in BST (UTC+1): 07:30Z = 08:30 local
    const july = new Date('2026-07-06T07:30:00Z');
    expect(londonClock(july)).toEqual({ dayOfWeek: 1, minutes: 8 * 60 + 30 });
    expect(isWithinWorkingHours(monday9to5, july)).toBe(true);
  });
});
