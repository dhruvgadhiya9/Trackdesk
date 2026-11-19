import clsx from "clsx";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { forwardRef, useId } from "react";
import { ChevronDown, Search } from "lucide-react";

export { clsx as cn };

/* ---------------------------------------------------------------- Button */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold leading-tight whitespace-nowrap no-underline transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white border border-primary-600 shadow-primary hover:bg-primary-700 hover:text-white",
  secondary: "bg-surface text-ink-2 border border-line hover:bg-surface-2 hover:text-ink",
  ghost: "bg-transparent text-muted border border-transparent hover:bg-surface-3 hover:text-ink",
  danger: "bg-danger-600 text-white border border-danger-600 hover:bg-danger-700 hover:text-white",
};
const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "py-[11px] px-[18px] text-base",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return clsx(buttonBase, buttonVariants[variant], buttonSizes[size], extra);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", icon, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
    </button>
  );
});

export function IconButton({
  label,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        "relative inline-flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-muted hover:bg-surface-2 hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- Card */

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={clsx(
        "min-w-0 rounded-xl border border-line bg-surface shadow-card",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="m-0 text-base font-bold text-ink">{title}</h2>
        {subtitle && <p className="m-0 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------- Badge */

export type Tone = "success" | "danger" | "warning" | "info" | "primary" | "violet" | "neutral";

const toneClasses: Record<Tone, string> = {
  success: "bg-success-50 text-success-700",
  danger: "bg-danger-50 text-danger-700",
  warning: "bg-warning-50 text-warning-700",
  info: "bg-info-50 text-info-500",
  primary: "bg-primary-50 text-primary-700",
  violet: "bg-violet-50 text-violet-600",
  neutral: "bg-surface-3 text-ink-3",
};

export function Badge({ tone = "neutral", children, dot }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold",
        toneClasses[tone],
      )}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function toneBg(tone: Tone) {
  return toneClasses[tone];
}

/* ---------------------------------------------------------------- Avatar */

const avatarTones = ["bg-violet-600", "bg-primary-600", "bg-success-500", "bg-info-500", "bg-warning-500", "bg-pink-500"];

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarTones.length;
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        avatarTones[idx],
        size === "md" ? "size-10 text-base" : "size-8 text-xs",
      )}
    >
      {initials(name)}
    </span>
  );
}

/* ---------------------------------------------------------------- Inputs */

const controlClass =
  "h-[42px] w-full rounded-md border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-subtle focus:border-primary-600 focus:outline-none disabled:bg-surface-2";

export function SearchInput({
  label = "Search",
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={clsx(
        "inline-flex h-[42px] flex-[1_1_260px] items-center gap-2.5 rounded-md border border-line bg-surface px-3.5 focus-within:border-primary-600",
        className,
      )}
    >
      <Search aria-hidden="true" className="size-4 shrink-0 text-muted" />
      <span className="sr-only">{label}</span>
      <input
        id={id}
        type="search"
        className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
        {...rest}
      />
    </label>
  );
}

export function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="relative inline-flex h-[42px] items-center gap-2 whitespace-nowrap rounded-md border border-line bg-surface pl-3 pr-8 text-sm focus-within:border-primary-600"
    >
      <span className="font-medium text-muted">{label}:</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none border-0 bg-transparent font-semibold text-ink outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 size-4 text-muted" />
    </label>
  );
}

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: FieldShellProps & { id: string; children: ReactNode }) {
  return (
    <div className={clsx("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink-2">
        {label}
        {required && <span className="text-danger-600"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="m-0 text-xs font-medium text-danger-700">
          {error}
        </p>
      ) : hint ? (
        <p className="m-0 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  ...rest
}: FieldShellProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <FieldShell id={id} {...{ label, hint, error, required, className }}>
      <input
        id={id}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={clsx(controlClass, error && "border-danger-500")}
        {...rest}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  className,
  options,
  ...rest
}: FieldShellProps & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] }) {
  const id = useId();
  return (
    <FieldShell id={id} {...{ label, hint, error, required, className }}>
      <div className="relative">
        <select id={id} required={required} className={clsx(controlClass, "cursor-pointer appearance-none pr-9")} {...rest}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-3 size-4 text-muted" />
      </div>
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  className,
  ...rest
}: FieldShellProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <FieldShell id={id} {...{ label, hint, error, required, className }}>
      <textarea
        id={id}
        required={required}
        rows={4}
        className={clsx(controlClass, "h-auto py-2.5")}
        {...rest}
      />
    </FieldShell>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="cursor-pointer text-sm font-semibold text-ink-2">
          {label}
        </label>
        {description && <p className="m-0 text-xs text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative h-6 w-11 shrink-0 cursor-pointer rounded-full border-0 transition-colors",
          checked ? "bg-primary-600" : "bg-line-strong",
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "absolute top-0.5 size-5 rounded-full bg-white shadow-card transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}
