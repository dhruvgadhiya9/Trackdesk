"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button, SelectField, TextField, Tabs } from "@trackdesk/ui";
import { CheckboxGroup, ChoiceGroup, FormLayout, FormSection } from "@/components/FormLayout";

const sections = ["Business Settings", "Service Settings", "Payment Settings", "Notification Settings", "Security Settings"] as const;
const terms = ["Full Advance", "Partial Advance", "Post Service Payment"] as const;

export default function SettingsPage() {
  const [section, setSection] = useState<(typeof sections)[number]>("Business Settings");
  const [methods, setMethods] = useState(["Stripe Card", "ACH"]);
  const [term, setTerm] = useState<(typeof terms)[number]>("Post Service Payment");
  return (
    <FormLayout
      crumbs={["Home", "Settings"]}
      title="Company Settings"
      subtitle="Business, service, payment, notification and security settings."
      cancelHref="/owner"
      successHref="/owner/settings"
      submitLabel="Save Settings"
    >
      <Tabs label="Settings section" tabs={sections} value={section} onChange={setSection} />
      <div hidden={section !== "Business Settings"}>
        <FormSection title="Business Settings">
          <div className="flex items-center gap-4 sm:col-span-2">
            <span className="inline-flex size-16 items-center justify-center rounded-xl bg-primary-50 text-xl font-extrabold text-primary-700">CA</span>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-ink-2">Company logo</span>
              <span className="text-xs text-muted">PNG or SVG, 512 × 512 px recommended.</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={<Upload aria-hidden="true" className="size-3.5" />}>Upload</Button>
                <Button variant="ghost" size="sm">Remove</Button>
              </div>
            </div>
          </div>
          <TextField label="Company Name" name="company" required defaultValue="CoolAir Services LLC" />
          <SelectField label="Timezone" name="tz" required options={["(UTC-06:00) Central Time", "(UTC-05:00) Eastern Time", "(UTC-07:00) Mountain Time", "(UTC-08:00) Pacific Time", "(UTC+00:00) London"]} />
          <SelectField label="Currency" name="currency" required options={["USD — US Dollar", "GBP — British Pound", "CAD — Canadian Dollar"]} />
        </FormSection>
      </div>
      <div hidden={section !== "Service Settings"}>
        <FormSection title="Service Settings">
          <TextField label="Emergency Charges ($)" name="emergency" type="number" min={0} step="0.01" defaultValue="75.00" />
          <SelectField label="Default SLA" name="sla" options={["24 hours", "48 hours", "72 hours"]} defaultValue="48 hours" />
        </FormSection>
      </div>
      <div hidden={section !== "Payment Settings"}>
        <FormSection title="Payment Settings" columns={1}>
          <CheckboxGroup label="Payment Methods" options={["Stripe Card", "ACH", "Bank Transfer"]} value={methods} onChange={setMethods} />
          <ChoiceGroup label="Payment Terms" options={terms} value={term} onChange={setTerm} />
        </FormSection>
      </div>
      <div hidden={section !== "Notification Settings"}>
        <FormSection title="Notification Settings">
          <SelectField label="SMS Provider" name="sms" options={["Twilio", "Vonage"]} />
          <SelectField label="Email Provider" name="email" options={["SendGrid", "Postmark", "Amazon SES"]} />
        </FormSection>
      </div>
      <div hidden={section !== "Security Settings"}>
        <FormSection title="Security Settings">
          <SelectField label="Password Policy" name="pwd" options={["Strong (8+ chars, symbol, number)", "Very strong (12+ chars)"]} />
          <SelectField label="Session Timeout" name="timeout" options={["15 minutes", "30 minutes", "60 minutes"]} defaultValue="30 minutes" />
        </FormSection>
      </div>
    </FormLayout>
  );
}
