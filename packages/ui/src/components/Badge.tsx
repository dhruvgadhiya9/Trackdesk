import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import type { JobStatusKey } from '../tokens';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-bg-subtle text-fg',
        info: 'bg-info-subtle text-info-fg',
        success: 'bg-success-subtle text-success-fg',
        warning: 'bg-warning-subtle text-warning-fg',
        danger: 'bg-danger-subtle text-danger-fg',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

const STATUS_LABEL: Record<JobStatusKey, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  dispatched: 'Dispatched',
  en_route: 'En route',
  on_site: 'On site',
  completed: 'Completed',
  verified: 'Verified',
  invoiced: 'Invoiced',
  cancelled: 'Cancelled',
  overdue: 'Overdue',
};

const STATUS_DOT: Record<JobStatusKey, string> = {
  draft: 'bg-status-draft',
  scheduled: 'bg-status-scheduled',
  dispatched: 'bg-status-dispatched',
  en_route: 'bg-status-en-route',
  on_site: 'bg-status-on-site',
  completed: 'bg-status-completed',
  verified: 'bg-status-verified',
  invoiced: 'bg-status-invoiced',
  cancelled: 'bg-status-cancelled',
  overdue: 'bg-status-overdue',
};

/** Job status badge — every status from the OpenAPI JobStatus enum, including Overdue. */
export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatusKey;
  className?: string;
}) {
  const tone =
    status === 'overdue'
      ? 'danger'
      : status === 'verified' || status === 'completed'
        ? 'success'
        : 'neutral';
  return (
    <Badge tone={tone} className={className} data-status={status}>
      <span aria-hidden className={cn('h-2 w-2 rounded-full', STATUS_DOT[status])} />
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export const JOB_STATUSES = Object.keys(STATUS_LABEL) as JobStatusKey[];
