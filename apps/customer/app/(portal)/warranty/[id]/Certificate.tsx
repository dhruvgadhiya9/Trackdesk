"use client";

import { useState } from "react";
import { Award, FileDown, Share2 } from "lucide-react";
import { Button, Card, InfoItem, PageHeader, StatusBadge } from "@trackdesk/ui";
import { me, propertyById, type Warranty } from "@/lib/mock";

export function Certificate({ warranty: w }: { warranty: Warranty }) {
  const [shared, setShared] = useState(false);
  const share = async () => {
    const data = { title: `Warranty ${w.id}`, text: `${w.service} warranty valid until ${w.expiry}` };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(`${data.title}: ${data.text}`);
      setShared(true);
    } catch {
      /* user cancelled share */
    }
  };
  return (
    <>
      <PageHeader crumbs={["Home", "Warranty", w.id]} title="Warranty Certificate" />
      <Card className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col gap-6 rounded-xl border-2 border-primary-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Award aria-hidden="true" className="size-6" />
              </span>
              <div className="flex flex-col">
                <h2 className="m-0 text-xl font-extrabold text-ink">Warranty Certificate</h2>
                <span className="text-sm text-muted">Issued by {me.company} LLC</span>
              </div>
            </div>
            <StatusBadge status={w.status} />
          </div>
          <dl className="m-0 grid gap-5 sm:grid-cols-3">
            <InfoItem label="Warranty Number">{w.id}</InfoItem>
            <InfoItem label="Customer Name">{`${me.firstName} ${me.lastName}`}</InfoItem>
            <InfoItem label="Property">{propertyById(w.propertyId)?.name}</InfoItem>
            <InfoItem label="Service">{`${w.service} · ${w.detail}`}</InfoItem>
            <InfoItem label="Start Date">{w.start}</InfoItem>
            <InfoItem label="Expiry Date">{w.expiry}</InfoItem>
          </dl>
          <div>
            <h3 className="m-0 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">Coverage Details</h3>
            <p className="m-0 text-sm leading-relaxed text-ink-2">{w.coverage}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" icon={<FileDown aria-hidden="true" className="size-4" />} onClick={() => window.print()}>
            Print / Save PDF
          </Button>
          <Button icon={<Share2 aria-hidden="true" className="size-4" />} onClick={share}>
            Share Certificate
          </Button>
          {shared && <span role="status" className="text-sm font-semibold text-success-700">Shared</span>}
        </div>
      </Card>
    </>
  );
}
