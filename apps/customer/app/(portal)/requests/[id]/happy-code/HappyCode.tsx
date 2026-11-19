"use client";

// SECURITY-REVIEW-REQUIRED: Happy Code is a service-verification OTP. Real codes must be generated, hashed,
// rate-limited and expired server-side; the portal only displays the signed-in customer's own code.
import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, Copy, LifeBuoy, RefreshCw } from "lucide-react";
import { Button, buttonClass, Card, CardHeader, InfoItem, PageHeader, StatusBadge } from "@trackdesk/ui";
import type { ServiceRequest } from "@/lib/mock";

export function HappyCode({ req }: { req: ServiceRequest }) {
  const [copied, setCopied] = useState(false);
  const [resent, setResent] = useState(false);
  const code = req.happyCode ?? "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <PageHeader crumbs={["Home", "Requests", req.job, "Happy Code"]} title="Happy Code" />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <div className="flex flex-col items-center gap-4 rounded-xl bg-nav px-4 py-8">
            <span className="text-sm font-bold uppercase tracking-[0.08em] text-primary-300">Your Verification Code</span>
            <div className="flex flex-wrap justify-center gap-2.5" role="img" aria-label={`Code ${code.split("").join(" ")}`}>
              {code.split("").map((d, i) => (
                <span key={i} aria-hidden="true" className="inline-flex h-[70px] w-[58px] items-center justify-center rounded-xl bg-white text-4xl font-extrabold text-nav">
                  {d}
                </span>
              ))}
            </div>
            <StatusBadge status="Pending" />
            <span className="text-sm font-medium text-primary-200">Waiting for technician verification</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button icon={<Copy aria-hidden="true" className="size-4" />} onClick={copy}>
              {copied ? "Copied" : "Copy Code"}
            </Button>
            <Button variant="secondary" icon={<RefreshCw aria-hidden="true" className="size-4" />} onClick={() => setResent(true)} disabled={resent}>
              {resent ? "Code resent" : "Resend Code"}
            </Button>
            <Link href="/messages" className={buttonClass("ghost")}>
              <LifeBuoy aria-hidden="true" className="size-4" />
              Contact Support
            </Link>
          </div>
          <p className="m-0 mt-5 flex items-start gap-2.5 rounded-lg bg-warning-50 px-4 py-3 text-sm font-medium text-warning-700">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            Share this code with the technician only after confirming the service is complete.
          </p>
        </Card>
        <Card>
          <CardHeader title="Job" />
          <dl className="m-0 flex flex-col gap-4">
            <InfoItem label="Job Number">{req.job}</InfoItem>
            <InfoItem label="Service Name">{req.service}</InfoItem>
            <InfoItem label="Technician Name">{req.technician?.name ?? "—"}</InfoItem>
            <InfoItem label="Scheduled">{req.scheduled}</InfoItem>
          </dl>
        </Card>
      </div>
    </>
  );
}
