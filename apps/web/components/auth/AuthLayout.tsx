import type { ReactNode } from "react";
import { Share2 } from "lucide-react";

const stats = [
  { value: "42", label: "Today's jobs" },
  { value: "96%", label: "On-time visits" },
  { value: "4.9", label: "Customer rating" },
];

/** Split-screen auth layout from the `co-login` / `co-forgot` boards. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap">
      <section className="relative flex flex-[1_1_480px] flex-col justify-between gap-10 overflow-hidden bg-nav px-8 py-12 sm:px-16 sm:py-14">
        <div aria-hidden="true" className="absolute -bottom-64 -right-64 size-[680px] rounded-full bg-primary-600/20" />
        <div aria-hidden="true" className="absolute -bottom-32 -right-32 size-[440px] rounded-full bg-violet-600/15" />
        <div className="relative flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary-600 shadow-primary">
            <Share2 aria-hidden="true" className="size-6 text-white" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-white">TrackDesk</span>
        </div>
        <div className="relative flex max-w-[520px] flex-col gap-4">
          <p className="m-0 text-4xl font-extrabold leading-tight tracking-tight text-white">
            Run every job, crew and invoice from one place.
          </p>
          <p className="m-0 text-base leading-relaxed text-primary-200">
            Requests, quotes, dispatch, technicians, Happy Code verification and payments — built for HVAC,
            plumbing, electrical, solar and cleaning teams.
          </p>
          <div className="flex flex-wrap gap-3.5">
            {stats.map((s) => (
              <div key={s.label} className="flex min-w-[140px] flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                <span className="text-2xl font-extrabold text-white">{s.value}</span>
                <span className="text-xs font-medium text-primary-300">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative m-0 text-sm font-medium text-nav-section">© 2026 TrackDesk · GDPR compliant</p>
      </section>
      <section className="flex flex-[1_1_420px] items-center justify-center bg-surface px-8 py-12">
        <div className="flex w-full max-w-[420px] flex-col gap-5">{children}</div>
      </section>
    </div>
  );
}
