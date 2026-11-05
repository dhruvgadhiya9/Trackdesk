import type { DragEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface MapMarker {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  kind: 'technician' | 'site';
}

/**
 * Map panel placeholder. Sprint 3 swaps the body for the Maps adapter (Google Maps / Mapbox);
 * the props contract stays the same. Markers are positioned within the bounding box of the points.
 */
export function MapPanel({ markers, title = 'Map' }: { markers: MapMarker[]; title?: string }) {
  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];
  const pos = (m: MapMarker) => ({
    left: `${maxLng === minLng ? 50 : ((m.longitude - minLng) / (maxLng - minLng)) * 90 + 5}%`,
    top: `${maxLat === minLat ? 50 : (1 - (m.latitude - minLat) / (maxLat - minLat)) * 90 + 5}%`,
  });
  return (
    <section
      aria-label={title}
      className="relative h-80 overflow-hidden rounded-lg border border-border bg-bg-subtle"
    >
      <span className="absolute left-3 top-3 rounded-md bg-bg-surface px-2 py-1 text-xs text-fg-muted shadow-sm">
        {title} · map provider pending (Sprint 3)
      </span>
      {markers.map((m) => (
        <span
          key={m.id}
          title={m.label}
          aria-label={m.label}
          style={pos(m)}
          className={cn(
            'absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg-surface shadow-md',
            m.kind === 'technician' ? 'bg-primary' : 'bg-status-on-site',
          )}
        />
      ))}
    </section>
  );
}

export interface TimelineSlotProps {
  label: string;
  /** Allowed drop target (working hours, not double-booked). */
  available?: boolean;
  onDropJob?: (jobId: string) => void;
  children?: ReactNode;
}

/** One hour slot on a technician's dispatch-board row. Accepts dropped job ids. */
export function TimelineSlot({ label, available = true, onDropJob, children }: TimelineSlotProps) {
  return (
    <div
      data-testid="timeline-slot"
      aria-label={label}
      onDragOver={(e: DragEvent) => available && e.preventDefault()}
      onDrop={(e: DragEvent) => {
        const id = e.dataTransfer.getData('text/job-id');
        if (available && id) onDropJob?.(id);
      }}
      className={cn(
        'min-h-16 border-l border-border p-1',
        available ? 'bg-bg-surface' : 'bg-bg-subtle',
      )}
    >
      {children}
    </div>
  );
}

export function TimelineRow({
  header,
  hours,
  renderSlot,
}: {
  header: ReactNode;
  hours: number[];
  renderSlot: (hour: number) => ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 border-b border-border">
      <div className="col-span-2 flex items-center px-3 py-2 text-sm font-medium text-fg">
        {header}
      </div>
      <div className="col-span-10 grid grid-cols-10">
        {hours.map((h) => (
          <div key={h}>{renderSlot(h)}</div>
        ))}
      </div>
    </div>
  );
}

/** Simple month calendar grid (PM schedules, upcoming maintenance). */
export function Calendar({
  year,
  month,
  renderDay,
}: {
  year: number;
  month: number;
  renderDay?: (date: Date) => ReactNode;
}) {
  const first = new Date(Date.UTC(year, month, 1));
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  const cells = Array.from({ length: offset + days }, (_, i) =>
    i < offset ? null : new Date(Date.UTC(year, month, i - offset + 1)),
  );
  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
        <div key={d} className="bg-bg-subtle px-2 py-1 text-xs font-semibold text-fg-muted">
          {d}
        </div>
      ))}
      {cells.map((date, i) => (
        <div key={i} className="min-h-20 bg-bg-surface p-1 text-xs text-fg">
          {date ? (
            <>
              <span className="text-fg-muted">{date.getUTCDate()}</span>
              {renderDay?.(date)}
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}
