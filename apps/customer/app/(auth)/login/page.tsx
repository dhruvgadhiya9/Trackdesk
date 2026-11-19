"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { AuthLayout, Button, Tabs, TextField } from "@trackdesk/ui";

const modes = ["Login", "Register Account"] as const;

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<(typeof modes)[number]>("Login");
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    // TODO(auth): real customer sign-in / registration. Mock only — any credentials work.
    if (mode === "Register Account") {
      setRegistered(true);
      return;
    }
    setBusy(true);
    setTimeout(() => router.push("/"), 400);
  };

  return (
    <AuthLayout>
      <Tabs label="Account" tabs={modes} value={mode} onChange={(m) => { setMode(m); setRegistered(false); }} />
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <h1 className="m-0 text-3xl font-extrabold tracking-tight text-ink">
          {mode === "Login" ? "Welcome to your service portal" : "Create your account"}
        </h1>
        <p className="m-0 text-base text-muted">Track requests, approve quotes and pay invoices in one place.</p>
        {registered ? (
          <p role="status" className="m-0 rounded-lg bg-success-50 px-4 py-3 text-sm font-semibold text-success-700">
            Check your email to verify your account, then log in.
          </p>
        ) : (
          <>
            {mode === "Register Account" && <TextField label="Full Name" name="name" autoComplete="name" required />}
            <TextField label="Email / Mobile Number" name="login" autoComplete="username" required />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete={mode === "Login" ? "current-password" : "new-password"}
              minLength={mode === "Login" ? undefined : 8}
              required
              placeholder="Enter your password"
            />
            {mode === "Login" && (
              <Link href="#" className="self-end text-sm font-bold">Forgot password?</Link>
            )}
            <Button
              type="submit"
              disabled={busy}
              className="w-full py-3.5"
              icon={mode === "Login" ? <LogIn aria-hidden="true" className="size-4" /> : <UserPlus aria-hidden="true" className="size-4" />}
            >
              {busy ? "Signing in…" : mode === "Login" ? "Login" : "Create Account"}
            </Button>
          </>
        )}
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" /> or continue with <span className="h-px flex-1 bg-line" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Google", "Apple", "Microsoft"].map((p) => (
            <Button key={p} variant="secondary" disabled title="Social sign-in is not configured yet">{p}</Button>
          ))}
        </div>
      </form>
    </AuthLayout>
  );
}
