import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

const fieldClass =
  'h-10 w-full rounded-md border border-border bg-bg-surface px-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-border-focus disabled:bg-bg-subtle';

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
}

function FieldShell({
  id,
  label,
  hint,
  error,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger-fg">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const generated = useId();
    const inputId = id ?? generated;
    return (
      <FieldShell id={inputId} label={label} hint={hint} error={error}>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(fieldClass, error && 'border-danger', className)}
          {...props}
        />
      </FieldShell>
    );
  },
);
Input.displayName = 'Input';

export type SelectOption = { value: string; label: string };
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  FieldProps & { options: SelectOption[]; placeholder?: string };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, className, id, ...props }, ref) => {
    const generated = useId();
    const selectId = id ?? generated;
    return (
      <FieldShell id={selectId} label={label} hint={hint} error={error}>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={cn(fieldClass, 'pr-8', error && 'border-danger', className)}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  },
);
Select.displayName = 'Select';
