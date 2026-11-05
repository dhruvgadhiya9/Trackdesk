import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-bg-surface px-6 py-12 text-center"
    >
      <div aria-hidden className="h-12 w-12 rounded-full bg-bg-subtle" />
      <h3 className="text-md font-semibold text-fg">{title}</h3>
      {description ? <p className="max-w-md text-sm text-fg-muted">{description}</p> : null}
      {action}
    </div>
  );
}

export function LoadingState({ label = 'Loading…', rows = 3 }: { label?: string; rows?: number }) {
  return (
    <div
      data-testid="loading-state"
      role="status"
      aria-live="polite"
      className="flex flex-col gap-2"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-md bg-bg-subtle" />
      ))}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      data-testid="error-state"
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-danger bg-danger-subtle px-6 py-10 text-center',
        className,
      )}
    >
      <h3 className="text-md font-semibold text-danger-fg">{title}</h3>
      {description ? <p className="text-sm text-fg">{description}</p> : null}
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
