import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button, ErrorState, Input, JOB_STATUSES, JobStatusBadge, Table } from '../src';
import { trackdeskPreset } from '../src/tailwind-preset';
import { semantic, spacing } from '../src/tokens';

describe('tokens -> Tailwind preset', () => {
  it('replaces (not extends) colours and spacing with tokens only', () => {
    const colors = trackdeskPreset.theme.colors as Record<string, unknown>;
    expect(colors).not.toHaveProperty('red');
    expect((colors.primary as Record<string, string>).DEFAULT).toBe(
      semantic.color.primary.default.$value,
    );
    expect(trackdeskPreset.theme.spacing['4']).toBe(`${spacing[4].$value}px`);
  });
  it('has a status colour for every job status', () => {
    const status = (
      trackdeskPreset.theme.colors as unknown as Record<string, Record<string, string>>
    ).status!;
    expect(Object.keys(status)).toHaveLength(JOB_STATUSES.length);
  });
});

describe('components', () => {
  it('Button shows a busy state while loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('Input links its error to the field', () => {
    render(<Input label="Postcode" error="Invalid postcode" />);
    const input = screen.getByLabelText('Postcode');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid postcode');
  });

  it.each(JOB_STATUSES)('JobStatusBadge renders %s', (status) => {
    render(<JobStatusBadge status={status} />);
    expect(document.querySelector(`[data-status="${status}"]`)).not.toBeNull();
  });

  it('ErrorState retries', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('Table renders rows and handles clicks', () => {
    const onRowClick = vi.fn();
    render(
      <Table
        rows={[{ id: '1', name: 'Northside' }]}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
        columns={[{ key: 'name', header: 'Name', render: (r) => r.name }]}
      />,
    );
    fireEvent.click(screen.getByText('Northside'));
    expect(onRowClick).toHaveBeenCalledWith({ id: '1', name: 'Northside' });
  });
});
