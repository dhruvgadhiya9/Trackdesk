"use client";

// SECURITY-REVIEW-REQUIRED: creates a tenant and invites its admin (credentials emailed). Tenant provisioning must be server-side.
import { SelectField, TextField } from "@trackdesk/ui";
import { FormLayout, FormSection } from "@/components/FormLayout";
import { plans } from "@/lib/platform-mock";

export default function CreateCompanyPage() {
  return (
    <FormLayout
      crumbs={["Home", "Companies", "Create Company"]}
      title="Create Company"
      subtitle="Create a new SaaS tenant and invite its company admin."
      cancelHref="/platform/companies"
      submitLabel="Save Company"
    >
      <FormSection step={1} title="Company Information" subtitle="Basic tenant details used across invoices and the customer portal.">
        <TextField label="Company Name" name="name" required />
        <TextField label="Company Code" name="code" required placeholder="e.g. CAS-001" pattern="[A-Z]{3}-[0-9]{3}" hint="Format: ABC-123" />
        <SelectField label="Industry" name="industry" required options={["HVAC & Plumbing", "Electrical & Solar", "Cleaning & Facilities"]} />
        <TextField label="Website" name="website" type="url" placeholder="https://" />
        <SelectField label="Country" name="country" required options={["United States", "Canada", "United Kingdom"]} />
        <SelectField label="Time Zone" name="tz" required options={["(UTC-06:00) Central Time", "(UTC-05:00) Eastern Time", "(UTC-08:00) Pacific Time", "(UTC+00:00) London"]} />
      </FormSection>
      <FormSection step={2} title="Company Admin" subtitle="This person receives login credentials by email.">
        <TextField label="First Name" name="first" required />
        <TextField label="Last Name" name="last" required />
        <TextField label="Email" name="email" type="email" required />
        <TextField label="Mobile" name="mobile" type="tel" required />
      </FormSection>
      <FormSection step={3} title="Subscription" columns={3}>
        <SelectField label="Plan" name="plan" required options={plans.filter((p) => p.status === "Active").map((p) => `${p.name} — $${p.monthly} / month`)} />
        <TextField label="Start Date" name="start" type="date" required />
        <TextField label="End Date" name="end" type="date" required />
      </FormSection>
      <FormSection step={4} title="Limits" subtitle="Hard limits enforced for this tenant." columns={3}>
        <TextField label="Max Users" name="maxUsers" type="number" min={1} required defaultValue="100" />
        <TextField label="Max Branches" name="maxBranches" type="number" min={1} required defaultValue="10" />
        <TextField label="Storage Allocation (GB)" name="storage" type="number" min={1} required defaultValue="250" />
      </FormSection>
    </FormLayout>
  );
}
