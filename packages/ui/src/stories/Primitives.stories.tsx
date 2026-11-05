import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Avatar } from '../components/Layout';
import { Badge, JOB_STATUSES, JobStatusBadge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';

const meta: Meta = { title: 'Primitives', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['primary', 'secondary', 'ghost', 'danger', 'link'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Button key={size} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))}
          <Button variant={variant} disabled>
            disabled
          </Button>
          <Button variant={variant} loading>
            loading
          </Button>
        </div>
      ))}
    </div>
  ),
};

function InputsDemo() {
  const [value, setValue] = useState('');
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Input
        label="Customer name"
        placeholder="Northside Academy"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Input label="Email" hint="Used for certificates and invoices" />
      <Input label="Postcode" error="Enter a valid UK postcode" defaultValue="XX" />
      <Input label="Disabled" disabled defaultValue="Read only" />
      <Select
        label="Standard"
        placeholder="Choose…"
        options={[
          { value: 'BS5839', label: 'BS 5839 (fire alarm)' },
          { value: 'BS5266', label: 'BS 5266 (emergency lighting)' },
        ]}
      />
      <Select
        label="Role"
        error="Required"
        options={[{ value: 'field_worker', label: 'Field worker' }]}
      />
    </div>
  );
}

export const Inputs: Story = { render: () => <InputsDemo /> };

export const Badges: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
          <Badge key={tone} tone={tone}>
            {tone}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {JOB_STATUSES.map((s) => (
          <JobStatusBadge key={s} status={s} />
        ))}
      </div>
    </div>
  ),
};

export const Avatars: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" size="md" />
      <Avatar name="Alan Turing" size="lg" />
    </div>
  ),
};
