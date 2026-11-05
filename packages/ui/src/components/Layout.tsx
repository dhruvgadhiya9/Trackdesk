import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-fg">{title}</h1>
        {description ? <p className="mt-1 text-sm text-fg-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </header>
  );
}

export interface NavItem {
  href: string;
  label: string;
  active?: boolean;
}

export function Sidebar({
  items,
  brand = 'TrackDesk',
  footer,
  renderLink,
}: {
  items: NavItem[];
  brand?: string;
  footer?: ReactNode;
  renderLink?: (item: NavItem, className: string) => ReactNode;
}) {
  return (
    <nav
      aria-label="Main"
      className="flex h-full w-64 flex-col gap-1 border-r border-border bg-bg-surface p-4"
    >
      <div className="mb-6 px-2 text-lg font-bold text-fg">{brand}</div>
      {items.map((item) => {
        const className = cn(
          'rounded-md px-3 py-2 text-sm font-medium',
          item.active
            ? 'bg-primary-subtle text-primary'
            : 'text-fg-muted hover:bg-bg-subtle hover:text-fg',
        );
        return renderLink ? (
          <div key={item.href}>{renderLink(item, className)}</div>
        ) : (
          <a
            key={item.href}
            href={item.href}
            className={className}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.label}
          </a>
        );
      })}
      {footer ? <div className="mt-auto">{footer}</div> : null}
    </nav>
  );
}

export function AppShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-canvas">
      <aside className="sticky top-0 h-screen">{sidebar}</aside>
      <main className="mx-auto w-full max-w-content flex-1 px-8 py-8">{children}</main>
    </div>
  );
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ tabs, initial }: { tabs: TabItem[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium',
              active === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-fg-muted hover:text-fg',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) =>
        t.id === active ? (
          <div
            key={t.id}
            role="tabpanel"
            id={`panel-${t.id}`}
            aria-labelledby={`tab-${t.id}`}
            className="pt-4"
          >
            {t.content}
          </div>
        ) : null,
      )}
    </div>
  );
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  return (
    <span
      aria-label={name}
      title={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-primary-subtle font-semibold text-primary',
        size === 'sm' && 'h-6 w-6 text-xs',
        size === 'md' && 'h-8 w-8 text-sm',
        size === 'lg' && 'h-12 w-12 text-md',
      )}
    >
      {initials}
    </span>
  );
}
