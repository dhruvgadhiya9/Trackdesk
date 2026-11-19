"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button, SelectField, TextField } from "@trackdesk/ui";
import { AuthLayout } from "@/components/auth/AuthLayout";

// Demo-only workspace picker until real auth assigns the role from the session.
const workspaces = { "Company Owner": "/owner", "Operations Manager": "/ops" } as const;

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [workspace, setWorkspace] = useState<keyof typeof workspaces>("Company Owner");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get("email") || !data.get("password")) {
      setError("Enter your email and password.");
      return;
    }
    setError(undefined);
    setBusy(true);
    // TODO(auth): replace with real sign-in (Supabase Auth / backend session). Mock only.
    setTimeout(() => router.push(workspaces[workspace]), 400);
  };

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <h1 className="m-0 text-3xl font-extrabold tracking-tight text-ink">Welcome back</h1>
        <p className="m-0 text-base text-muted">Sign in to your company workspace.</p>
        <TextField label="Email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
        <TextField
          label="Password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          error={error}
        />
        <SelectField
          label="Workspace (demo)"
          options={Object.keys(workspaces)}
          value={workspace}
          onChange={(e) => setWorkspace(e.target.value as keyof typeof workspaces)}
          hint="Mock sign-in — any email and password work."
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-2">
            <input type="checkbox" className="size-4 accent-primary-600" checked={show} onChange={(e) => setShow(e.target.checked)} />
            Show password
          </label>
          <Link href="/forgot-password" className="text-sm font-bold">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" disabled={busy} className="w-full py-3.5" icon={<LogIn aria-hidden="true" className="size-4" />}>
          {busy ? "Signing in…" : "Login"}
        </Button>
        <p className="m-0 text-center text-xs text-muted">
          By continuing you agree to the <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a>.
        </p>
      </form>
    </AuthLayout>
  );
}
