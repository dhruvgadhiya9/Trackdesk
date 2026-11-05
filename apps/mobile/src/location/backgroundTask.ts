// SECURITY-REVIEW-REQUIRED: background location task (Sprint 1 spike, Sprint 4 completes).
import * as TaskManager from 'expo-task-manager';

export const LOCATION_TASK = 'trackdesk-background-location';

/**
 * Registered at app start (index.ts) so the OS can wake it. Tracking is only STARTED after the
 * consent screen and when policy.shouldTrack() is true. Sprint 4: write points to the expo-sqlite
 * queue and upload via POST /v1/fieldwork/location-pings. Until then points are dropped.
 */
TaskManager.defineTask(LOCATION_TASK, async ({ error }) => {
  if (error) {
    console.warn('[location] task error', error.message);
  }
});
