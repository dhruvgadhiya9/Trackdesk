import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/** Accessible dialog (native <dialog>, focus trapped by the browser, Esc closes). */
export function Modal({ open, title, onClose, children, footer, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal?.();
    if (!open && dialog.open) dialog.close?.();
  }, [open]);
  if (!open) return null;
  return (
    <dialog
      ref={ref}
      open
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={cn(
        'z-modal w-full rounded-xl border border-border bg-bg-surface p-0 text-fg shadow-lg',
        size === 'sm' && 'max-w-sm',
        size === 'md' && 'max-w-lg',
        size === 'lg' && 'max-w-2xl',
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <Button variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
          ✕
        </Button>
      </div>
      <div className="px-6 py-4">{children}</div>
      {footer ? (
        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>
      ) : null}
    </dialog>
  );
}

type ToastTone = 'info' | 'success' | 'danger';
interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}
const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, message, tone }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 5000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-toast flex flex-col gap-2">
        {items.map((t) => (
          <Toast key={t.id} tone={t.tone} message={t.message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function Toast({ message, tone = 'info' }: { message: string; tone?: ToastTone }) {
  return (
    <div
      role="status"
      className={cn(
        'min-w-64 rounded-md border px-4 py-3 text-sm shadow-md',
        tone === 'info' && 'border-info bg-info-subtle text-info-fg',
        tone === 'success' && 'border-success bg-success-subtle text-success-fg',
        tone === 'danger' && 'border-danger bg-danger-subtle text-danger-fg',
      )}
    >
      {message}
    </div>
  );
}

export const useToast = () => useContext(ToastContext);
