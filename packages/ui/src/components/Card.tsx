'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { JobStatusBadge } from './Badge';
import type { JobStatusKey } from '../tokens';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-bg-surface p-4 shadow-sm', className)}
      {...props}
    />
  );
}

export function CardHeader({ title, actions }: { title: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-md font-semibold text-fg">{title}</h3>
      {actions}
    </div>
  );
}

export interface JobCardProps {
  reference: string;
  title?: string;
  siteName?: string;
  status: JobStatusKey;
  timeRange?: string;
  technicianName?: string;
  compact?: boolean;
  onClick?: () => void;
  draggable?: boolean;
}

/** Job summary used on lists, the dispatch board timeline and the unassigned queue. */
export function JobCard({
  reference,
  title,
  siteName,
  status,
  timeRange,
  technicianName,
  compact,
  onClick,
  draggable,
}: JobCardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      draggable={draggable}
      data-testid="job-card"
      className={cn(
        'flex flex-col gap-1 rounded-md border border-border bg-bg-surface shadow-sm',
        status === 'overdue' && 'border-danger',
        compact ? 'p-2' : 'p-3',
        onClick && 'cursor-pointer hover:border-border-strong',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-fg-muted">{reference}</span>
        <JobStatusBadge status={status} />
      </div>
      {title ? <p className="text-sm font-medium text-fg">{title}</p> : null}
      {!compact && siteName ? <p className="text-xs text-fg-muted">{siteName}</p> : null}
      {(timeRange || technicianName) && !compact ? (
        <p className="text-xs text-fg-muted">
          {[timeRange, technicianName].filter(Boolean).join(' · ')}
        </p>
      ) : null}
    </div>
  );
}
