"use client";

import { useState } from "react";
import { AlertTriangle, UploadCloud } from "lucide-react";
import { SelectField, TextAreaField } from "@trackdesk/ui";
import { CheckboxGroup, ChoiceGroup, FormLayout, FormSection } from "@/components/FormLayout";
import { customers, properties, services } from "@/lib/mock";

const priorities = ["Normal", "High", "Emergency"] as const;

export default function RequestCreatePage() {
  const [customer, setCustomer] = useState(customers[0]!.name);
  const [priority, setPriority] = useState<(typeof priorities)[number]>("Normal");
  const [extra, setExtra] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const custProps = properties.filter((p) => p.customer === customer);
  return (
    <FormLayout crumbs={["Home", "Service Requests", "Create"]} title="Create Service Request" cancelHref="/owner/requests" submitLabel="Create Request">
      <FormSection step={1} title="Customer" subtitle="Raise a request on behalf of a customer.">
        <SelectField label="Customer" name="customer" required options={customers.map((c) => c.name)} value={customer} onChange={(e) => setCustomer(e.target.value)} />
        <SelectField label="Property" name="property" required options={custProps.length ? custProps.map((p) => `${p.name} · ${p.address}`) : ["No properties — add one first"]} />
      </FormSection>
      <FormSection step={2} title="Service Selection">
        <SelectField label="Category" name="category" required options={[...new Set(services.map((s) => s.category))]} />
        <SelectField label="Service" name="service" required options={services.map((s) => s.name)} />
        <CheckboxGroup label="Additional services (multi-service job)" options={["Electrical — Wiring check", "Plumbing", "Cleaning"]} value={extra} onChange={setExtra} className="sm:col-span-2" />
        <TextAreaField label="Problem Description" name="description" className="sm:col-span-2" placeholder="Describe the issue in the customer's words…" />
      </FormSection>
      <FormSection step={3} title="Priority" columns={1}>
        <ChoiceGroup label="Priority" options={priorities} value={priority} onChange={setPriority} />
        {priority === "Emergency" && (
          <p role="status" className="m-0 flex items-center gap-2 rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
            <AlertTriangle aria-hidden="true" className="size-4" />
            Emergency selected: emergency charges of $75.00 will be added on top of standard charges.
          </p>
        )}
      </FormSection>
      <FormSection step={4} title="Upload" columns={1}>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-surface-2 px-6 py-10 text-center hover:border-primary-300">
          <UploadCloud aria-hidden="true" className="size-8 text-primary-600" />
          <span className="text-sm font-semibold text-ink-2">Drag & drop files or <span className="text-primary-700">browse</span></span>
          <span className="text-xs text-muted">PNG, JPG, MP4, PDF up to 50 MB</span>
          <input
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.mp4,.pdf"
            className="sr-only"
            onChange={(e) => setFiles([...(e.target.files ?? [])].map((f) => f.name))}
          />
        </label>
        {files.length > 0 && (
          <ul className="m-0 list-disc pl-5 text-sm text-ink-2">
            {files.map((f) => <li key={f}>{f}</li>)}
          </ul>
        )}
      </FormSection>
    </FormLayout>
  );
}
