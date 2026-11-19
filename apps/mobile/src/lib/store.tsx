// SECURITY-REVIEW-REQUIRED: holds technician location (check-in/start-job GPS) and Happy Code attempts.
// In production, location is captured only on explicit actions (check-in, start job, one-off share) with consent,
// and Happy Code verification/attempt limits are enforced server-side.
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { jobs as seedJobs, MOCK_HAPPY_CODE, type Job, type JobStatus } from "./mock";

export type Availability = "Available" | "Busy" | "On Leave";

export interface JobProgress {
  checklist: boolean[];
  checklistSubmitted: boolean;
  activities: boolean[];
  notes: string;
  proofSubmitted: boolean;
  happyAttemptsLeft: number;
  happyVerifiedAt?: string;
  startedAt?: string;
  pauseReason?: string;
}

interface State {
  jobs: Job[];
  progress: Record<string, JobProgress>;
  checkedInAt?: string;
  checkedOutAt?: string;
  availability: Availability;
  signedIn: boolean;
}

const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

function initialProgress(job: Job): JobProgress {
  const done = job.status === "Completed";
  return {
    checklist: job.checklist.map((_, i) => done || (job.id === "JOB-1048" && i < 2)),
    checklistSubmitted: done,
    activities: job.activities.map((_, i) => done || i < 3),
    notes: "",
    proofSubmitted: done,
    happyAttemptsLeft: 3,
    happyVerifiedAt: done ? "08:55" : undefined,
  };
}

interface Store extends State {
  job: (id: string) => Job | undefined;
  setStatus: (id: string, status: JobStatus, extra?: Partial<JobProgress>) => void;
  updateProgress: (id: string, patch: Partial<JobProgress>) => void;
  verifyHappyCode: (id: string, code: string) => "ok" | "invalid" | "locked";
  checkIn: () => void;
  checkOut: () => void;
  setAvailability: (a: Availability) => void;
  signIn: () => void;
  signOut: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => ({
    jobs: seedJobs,
    progress: Object.fromEntries(seedJobs.map((j) => [j.id, initialProgress(j)])),
    checkedInAt: "07:58",
    availability: "Available",
    signedIn: false,
  }));

  const updateProgress = useCallback((id: string, patch: Partial<JobProgress>) => {
    setState((s) => ({ ...s, progress: { ...s.progress, [id]: { ...s.progress[id]!, ...patch } } }));
  }, []);

  const setStatus = useCallback((id: string, status: JobStatus, extra?: Partial<JobProgress>) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, status } : j)),
      progress: extra ? { ...s.progress, [id]: { ...s.progress[id]!, ...extra } } : s.progress,
    }));
  }, []);

  const verifyHappyCode = useCallback(
    (id: string, code: string) => {
      const p = state.progress[id];
      if (!p || p.happyAttemptsLeft <= 0) return "locked" as const;
      if (code === MOCK_HAPPY_CODE) {
        setStatus(id, "Completed", { happyVerifiedAt: now() });
        return "ok" as const;
      }
      updateProgress(id, { happyAttemptsLeft: p.happyAttemptsLeft - 1 });
      return p.happyAttemptsLeft - 1 <= 0 ? ("locked" as const) : ("invalid" as const);
    },
    [state.progress, setStatus, updateProgress],
  );

  const value = useMemo<Store>(
    () => ({
      ...state,
      job: (id) => state.jobs.find((j) => j.id === id),
      setStatus,
      updateProgress,
      verifyHappyCode,
      checkIn: () => setState((s) => ({ ...s, checkedInAt: now(), checkedOutAt: undefined })),
      checkOut: () => setState((s) => ({ ...s, checkedOutAt: now() })),
      setAvailability: (availability) => setState((s) => ({ ...s, availability })),
      signIn: () => setState((s) => ({ ...s, signedIn: true })),
      signOut: () => setState((s) => ({ ...s, signedIn: false })),
    }),
    [state, setStatus, updateProgress, verifyHappyCode],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

/** All three completion gates from the design: checklist, proof, Happy Code. */
export function completionGates(p: JobProgress) {
  return [
    { label: "Checklist completed", done: p.checklistSubmitted },
    { label: "Proof uploaded", done: p.proofSubmitted },
    { label: "Happy Code verified", done: !!p.happyVerifiedAt },
  ];
}
