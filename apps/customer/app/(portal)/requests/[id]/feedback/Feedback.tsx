"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import clsx from "clsx";
import { Star, UploadCloud } from "lucide-react";
import { Avatar, Button, buttonClass, Card, PageHeader, TextAreaField } from "@trackdesk/ui";
import type { ServiceRequest } from "@/lib/mock";

const criteria = ["Service Quality", "Technician Behaviour", "Timeliness", "Overall Satisfaction"] as const;
const words = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

function StarRating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <fieldset className="m-0 flex flex-wrap items-center justify-between gap-3 border-0 border-b border-line-soft p-0 pb-3">
      <legend className="float-left p-0 text-sm font-semibold text-ink-2">{label}</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input type="radio" name={label} value={n} checked={value === n} onChange={() => onChange(n)} className="peer sr-only" />
            <span className="sr-only">
              {n} star{n > 1 ? "s" : ""}
            </span>
            <Star
              aria-hidden="true"
              className={clsx(
                "size-7 rounded peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-primary-600",
                n <= value ? "fill-warning-500 text-warning-500" : "text-line-strong",
              )}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Feedback({ req }: { req: ServiceRequest }) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();
  const overall = ratings["Overall Satisfaction"] ?? 0;
  const tech = req.technician?.name ?? "your technician";
  const first = tech.split(" ")[0];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (criteria.some((c) => !ratings[c])) return setError("Please rate all four areas.");
    setDone(true);
  };

  if (done) {
    return (
      <Card className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
        <h1 className="m-0 text-2xl font-extrabold text-ink">Thank you!</h1>
        <p role="status" className="m-0 text-sm text-muted">
          Your feedback helps {first} and the team improve.
        </p>
        <Link href="/" className={buttonClass("primary")}>Back to dashboard</Link>
      </Card>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <PageHeader crumbs={["Home", "Requests", req.job, "Feedback"]} title="Rate your service" />
      <Card className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <Avatar name={tech} />
          <h2 className="m-0 text-lg font-bold text-ink">
            How was your {req.service} with {first}?
          </h2>
          {overall > 0 && <span className="text-sm font-semibold text-primary-700">{words[overall]}</span>}
        </div>
        {criteria.map((c) => (
          <StarRating key={c} label={c} value={ratings[c] ?? 0} onChange={(v) => setRatings((r) => ({ ...r, [c]: v }))} />
        ))}
        <TextAreaField label="Comments" name="comments" />
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-surface-2 px-6 py-6 text-center">
          <UploadCloud aria-hidden="true" className="size-6 text-primary-600" />
          <span className="text-sm font-semibold text-ink-2">
            Photos (optional) — drag & drop or <span className="text-primary-700">browse</span>
          </span>
          <input type="file" multiple accept="image/*" className="sr-only" />
        </label>
        {error && (
          <p role="alert" className="m-0 text-sm font-semibold text-danger-700">
            {error}
          </p>
        )}
        <Button type="submit" className="self-end">Submit Feedback</Button>
      </Card>
    </form>
  );
}
