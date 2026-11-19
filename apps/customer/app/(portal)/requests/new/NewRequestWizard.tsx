"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { AlertTriangle, ArrowLeft, ArrowRight, Link2, Mic, QrCode, Send, UploadCloud } from "lucide-react";
import { Button, Card, CardHeader, InfoItem, PageHeader, Stepper, TextAreaField } from "@trackdesk/ui";
import { properties } from "@/lib/mock";

const steps = ["Property", "Service", "Details", "Review"] as const;
const categories: Record<string, string[]> = {
  HVAC: ["AC Repair", "AC Installation", "AC Servicing"],
  Plumbing: ["Leak Detection & Repair", "Water Heater Repair", "Drain Cleaning"],
  Electrical: ["Breaker / Wiring Fault", "Panel Upgrade", "Lighting"],
  Solar: ["Solar Inspection", "Solar Panel Installation"],
  Cleaning: ["Deep Cleaning", "Duct Cleaning"],
  "Pest Control": ["General Pest Treatment"],
};
const EMERGENCY_FEE = "$75";

function OptionCard({ selected, onClick, title, sub }: { selected: boolean; onClick: () => void; title: string; sub?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={clsx(
        "flex cursor-pointer flex-col items-start gap-1 rounded-lg border-2 bg-surface p-4 text-left",
        selected ? "border-primary-600 bg-primary-50" : "border-line hover:border-primary-300",
      )}
    >
      <span className="text-sm font-bold text-ink">{title}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </button>
  );
}

export function NewRequestWizard({ initialProperty }: { initialProperty?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [propertyId, setPropertyId] = useState(properties.some((p) => p.id === initialProperty) ? initialProperty! : "");
  const [category, setCategory] = useState("HVAC");
  const [service, setService] = useState("");
  const [describeInstead, setDescribeInstead] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const property = properties.find((p) => p.id === propertyId);

  const next = () => {
    setError(undefined);
    if (step === 0 && !propertyId) return setError("Select a property.");
    if (step === 1 && !describeInstead && !service) return setError("Select a service, or choose to describe the problem.");
    if (step === 2 && description.trim().length < 10) return setError("Describe the problem in a few words (at least 10 characters).");
    setStep((s) => s + 1);
  };

  if (submitted) {
    return (
      <Card className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
        <h1 className="m-0 text-2xl font-extrabold text-ink">Request submitted</h1>
        <p role="status" className="m-0 text-sm text-muted">
          We will review it shortly and let you know when a technician is assigned.
        </p>
        <Button onClick={() => router.push("/requests")}>View my requests</Button>
      </Card>
    );
  }

  return (
    <>
      <PageHeader crumbs={["Home", "Requests", "New Request"]} title={step === 2 ? "Describe your problem" : "Request a Service"} />
      <Stepper steps={steps} current={step} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          {step === 0 && (
            <>
              <CardHeader title="Step 1 · Select Property" />
              <div className="grid gap-3 sm:grid-cols-3">
                {properties.map((p) => (
                  <OptionCard key={p.id} selected={propertyId === p.id} onClick={() => setPropertyId(p.id)} title={p.name} sub={`${p.address}, ${p.city}`} />
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <CardHeader title="Step 2 · Select Service" subtitle="Not sure what you need? Describe the problem instead." />
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
                  {Object.keys(categories).map((c) => (
                    <Button
                      key={c}
                      size="sm"
                      variant={category === c ? "primary" : "secondary"}
                      aria-pressed={category === c}
                      onClick={() => {
                        setCategory(c);
                        setService("");
                      }}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Service">
                  {categories[category]!.map((s) => (
                    <OptionCard
                      key={s}
                      selected={!describeInstead && service === s}
                      onClick={() => {
                        setService(s);
                        setDescribeInstead(false);
                      }}
                      title={s}
                    />
                  ))}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-2">
                  <input type="checkbox" className="size-4 accent-primary-600" checked={describeInstead} onChange={(e) => setDescribeInstead(e.target.checked)} />
                  I&apos;m not sure — I&apos;ll describe the problem instead
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <OptionCard selected={!emergency} onClick={() => setEmergency(false)} title="Regular Request" sub="Standard charges · next available slot" />
                  <OptionCard
                    selected={emergency}
                    onClick={() => setEmergency(true)}
                    title="Emergency Request"
                    sub={`Standard + ${EMERGENCY_FEE} emergency charges · priority dispatch`}
                  />
                </div>
                {emergency && (
                  <p className="m-0 flex items-center gap-2 rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
                    <AlertTriangle aria-hidden="true" className="size-4" />
                    An emergency charge of {EMERGENCY_FEE} is added on top of standard charges.
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader title="Problem Description" />
              <div className="flex flex-col gap-4">
                <TextAreaField
                  label="Description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is happening, since when, anything you have tried…"
                />
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-surface-2 px-6 py-8 text-center hover:border-primary-300">
                  <UploadCloud aria-hidden="true" className="size-7 text-primary-600" />
                  <span className="text-sm font-semibold text-ink-2">
                    Drag & drop files or <span className="text-primary-700">browse</span>
                  </span>
                  <span className="text-xs text-muted">Add photos or a short video of the problem</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="sr-only"
                    onChange={(e) => setFiles([...(e.target.files ?? [])].map((f) => f.name))}
                  />
                </label>
                {files.length > 0 && (
                  <ul className="m-0 list-disc pl-5 text-sm text-ink-2">
                    {files.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" icon={<Mic aria-hidden="true" className="size-4" />} disabled title="Voice notes are not available yet">
                    Record Voice Note
                  </Button>
                  <span className="text-sm text-muted">Hands-free: we turn your voice into text</span>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader title="Review your request" />
              <dl className="m-0 grid gap-5 sm:grid-cols-2">
                <InfoItem label="Property">{property ? `${property.name} · ${property.address}` : "—"}</InfoItem>
                <InfoItem label="Service">{describeInstead ? "To be classified by our team" : `${category} · ${service}`}</InfoItem>
                <InfoItem label="Priority">{emergency ? `Emergency (+${EMERGENCY_FEE})` : "Regular"}</InfoItem>
                <InfoItem label="Attachments">{files.length ? `${files.length} file(s)` : "None"}</InfoItem>
                <div className="sm:col-span-2">
                  <InfoItem label="Description">{description}</InfoItem>
                </div>
              </dl>
            </>
          )}

          {error && (
            <p role="alert" className="m-0 mt-4 text-sm font-semibold text-danger-700">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-between gap-2.5">
            <Button
              variant="secondary"
              icon={<ArrowLeft aria-hidden="true" className="size-4" />}
              disabled={step === 0}
              onClick={() => {
                setError(undefined);
                setStep((s) => s - 1);
              }}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button onClick={next}>
                Continue
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            ) : (
              <Button icon={<Send aria-hidden="true" className="size-4" />} onClick={() => setSubmitted(true)}>
                Submit Request
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Alternative Request Methods" />
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            <li className="flex gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <QrCode aria-hidden="true" className="size-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-ink">QR Code Request</span>
                <span className="text-xs text-muted">Scan the TrackDesk QR sticker on your equipment to raise a request instantly.</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Link2 aria-hidden="true" className="size-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-ink">Service Link Request</span>
                <span className="text-xs text-muted">Use your unique service link — no login needed.</span>
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </>
  );
}
