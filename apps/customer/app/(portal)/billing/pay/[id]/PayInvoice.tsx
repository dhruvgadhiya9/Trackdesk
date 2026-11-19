"use client";

// SECURITY-REVIEW-REQUIRED: payment flow. Card details must be collected by Stripe Elements / Checkout (hosted
// iframe) so card data never touches TrackDesk code or servers (PCI SAQ-A). Payment intents are created and
// confirmed server-side; this screen is a mock and charges nothing.
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";
import { Button, buttonClass, Card, CardHeader, ChoiceGroup, InfoItem, PageHeader, TextField } from "@trackdesk/ui";
import { me, money, type Invoice } from "@/lib/mock";

export function PayInvoice({ invoice }: { invoice: Invoice }) {
  const advance = invoice.terms?.includes("50%");
  const options = advance ? (["Advance (50%)", "Full amount"] as const) : (["Full amount"] as const);
  const [amountOption, setAmountOption] = useState<string>(options[0]);
  const [paid, setPaid] = useState(false);
  const due = amountOption === "Advance (50%)" ? Math.round(invoice.amount * 50) / 100 : invoice.amount;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setPaid(true);
  };

  if (paid) {
    return (
      <Card className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
        <CheckCircle2 aria-hidden="true" className="size-10 text-success-500" />
        <h1 className="m-0 text-2xl font-extrabold text-ink">Demo payment recorded</h1>
        <p role="status" className="m-0 text-sm text-muted">
          This is a mock — no card was charged. In production a receipt for {money(due)} is emailed after Stripe confirms the payment.
        </p>
        <Link href="/billing/history" className={buttonClass("primary")}>View payment history</Link>
      </Card>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <PageHeader crumbs={["Home", "Billing", "Pay"]} title="Make a Payment" />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader title="Billing Information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" name="name" autoComplete="name" required defaultValue={`${me.firstName} ${me.lastName}`} />
              <TextField label="Email" name="email" type="email" autoComplete="email" required defaultValue={me.email} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Payment Method" subtitle="Stripe · Card" />
            {advance && <ChoiceGroup label="Amount to pay" options={options} value={amountOption} onChange={setAmountOption} className="mb-4" />}
            <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line-strong bg-surface-2 px-6 py-8 text-center">
              <CreditCard aria-hidden="true" className="size-7 text-primary-600" />
              <span className="text-sm font-semibold text-ink-2">Stripe card form goes here</span>
              <span className="max-w-sm text-xs text-muted">
                Card number, expiry and CVC are entered in Stripe&apos;s secure form, not in TrackDesk. Not connected yet — this demo does not charge.
              </span>
            </div>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-2">
              <input type="checkbox" className="size-4 accent-primary-600" />
              Save card for future payments
            </label>
          </Card>
        </div>
        <Card>
          <CardHeader title="Invoice Summary" />
          <div className="mb-4 rounded-lg bg-primary-50 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">Amount Due · {invoice.id}</span>
            <span className="block text-2xl font-extrabold text-ink">{money(invoice.amount)}</span>
          </div>
          <dl className="m-0 flex flex-col gap-4">
            <InfoItem label="Service">{invoice.service}</InfoItem>
            <InfoItem label="Due Date">{invoice.due ?? "—"}</InfoItem>
            <InfoItem label="Payment Terms">{invoice.terms ?? "Post Service"}</InfoItem>
          </dl>
          <Button type="submit" className="mt-5 w-full py-3.5" icon={<Lock aria-hidden="true" className="size-4" />}>
            Pay Now · {money(due)}
          </Button>
          <p className="m-0 mt-3 text-center text-xs text-muted">Payments are processed securely by Stripe. TrackDesk never stores full card numbers.</p>
        </Card>
      </div>
    </form>
  );
}
