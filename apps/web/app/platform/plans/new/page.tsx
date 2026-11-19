"use client";

import { useState } from "react";
import { TextAreaField, TextField } from "@trackdesk/ui";
import { CheckboxGroup, FormLayout, FormSection } from "@/components/FormLayout";
import { planModules } from "@/lib/platform-mock";

export default function PlanEditPage() {
  const [modules, setModules] = useState(["CRM", "Customer Management", "Job Management", "Scheduling", "Invoicing", "Reporting", "Mobile App"]);
  const [monthly, setMonthly] = useState("199.00");
  const annualHint = Number(monthly) > 0 ? `12 × monthly = $${(Number(monthly) * 12).toFixed(2)}` : undefined;
  return (
    <FormLayout crumbs={["Home", "Subscription Plans", "Create"]} title="Create Subscription Plan" cancelHref="/platform/plans" submitLabel="Save Plan">
      <FormSection step={1} title="Plan Information" columns={1}>
        <TextField label="Plan Name" name="name" required />
        <TextAreaField label="Description" name="description" />
      </FormSection>
      <FormSection step={2} title="Pricing">
        <TextField label="Monthly Price ($)" name="monthly" type="number" min={0} step="0.01" required value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        <TextField label="Annual Price ($)" name="annual" type="number" min={0} step="0.01" required hint={annualHint} />
      </FormSection>
      <FormSection step={3} title="Limits" columns={3}>
        <TextField label="User Limit" name="users" type="number" min={1} required />
        <TextField label="Branch Limit" name="branches" type="number" min={1} required />
        <TextField label="Storage Limit (GB)" name="storage" type="number" min={1} required />
      </FormSection>
      <FormSection step={4} title="Feature Mapping" subtitle="Choose which modules tenants on this plan can access." columns={1}>
        <CheckboxGroup label="Modules" options={planModules} value={modules} onChange={setModules} />
      </FormSection>
    </FormLayout>
  );
}
