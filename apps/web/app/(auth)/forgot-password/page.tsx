"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { ChevronLeft, KeyRound, MailCheck, Send } from "lucide-react";
import { Button, TextField } from "@trackdesk/ui";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO(auth): call the password-reset endpoint. Always show the same message (no account enumeration).
    setSent(true);
  };

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <span className="inline-flex size-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          {sent ? <MailCheck aria-hidden="true" className="size-6" /> : <KeyRound aria-hidden="true" className="size-6" />}
        </span>
        <h1 className="m-0 text-3xl font-extrabold tracking-tight text-ink">{sent ? "Check your email" : "Forgot password?"}</h1>
        <p role={sent ? "status" : undefined} className="m-0 text-base text-muted">
          {sent
            ? "If an account exists for that email, a secure reset link is on its way."
            : "Enter the email linked to your account and we will send you a secure reset link."}
        </p>
        {!sent && (
          <>
            <TextField label="Email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
            <Button type="submit" className="w-full py-3.5" icon={<Send aria-hidden="true" className="size-4" />}>
              Send Reset Link
            </Button>
          </>
        )}
        <Link href="/login" className="inline-flex items-center gap-1.5 text-base font-bold no-underline">
          <ChevronLeft aria-hidden="true" className="size-4" /> Back to login
        </Link>
      </form>
    </AuthLayout>
  );
}
