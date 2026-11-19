"use client";

import { useState } from "react";
import { Card, SelectField, TextField, Toggle } from "@trackdesk/ui";
import { CheckboxGroup, FormLayout, FormSection } from "@/components/FormLayout";

export default function TaxRulePage() {
  const [taxableOn, setTaxableOn] = useState(["Labor", "Material"]);
  const [applicable, setApplicable] = useState(["GST Applicable", "QST Applicable"]);
  const [exempt, setExempt] = useState(true);
  const [gst, setGst] = useState("5");
  const [other, setOther] = useState("9.975");
  const total = (Number(gst) || 0) + (Number(other) || 0);
  return (
    <FormLayout crumbs={["Home", "Tax Master", "Add Tax Rule"]} title="Add Tax Rule" cancelHref="/owner/tax" submitLabel="Save Rule">
      <FormSection step={1} title="Location" columns={3}>
        <SelectField label="Country" name="country" required options={["Canada", "United States", "United Kingdom"]} />
        <TextField label="Province / State" name="region" required />
        <TextField label="Tax Type" name="taxType" required placeholder="e.g. GST + QST" />
      </FormSection>
      <FormSection step={2} title="Tax Applicability" columns={1}>
        <CheckboxGroup label="Taxable on" options={["Labor", "Material", "HVAC", "Plumbing", "Electrical", "Solar"]} value={taxableOn} onChange={setTaxableOn} />
        <CheckboxGroup label="Applicable taxes" options={["GST Applicable", "PST Applicable", "HST Applicable", "QST Applicable"]} value={applicable} onChange={setApplicable} />
        <SelectField label="Residential / Commercial Rules" name="scope" options={["Both", "Residential only", "Commercial only"]} />
        <Toggle label="Tax Exemption Support" description="Allow exempt customers with certificate" checked={exempt} onChange={setExempt} />
      </FormSection>
      <FormSection step={3} title="Rate" columns={3}>
        <TextField label="Primary rate %" name="rate1" type="number" step="0.001" min={0} required value={gst} onChange={(e) => setGst(e.target.value)} />
        <TextField label="Secondary rate %" name="rate2" type="number" step="0.001" min={0} value={other} onChange={(e) => setOther(e.target.value)} />
        <TextField label="Effective Date" name="effective" type="date" required />
      </FormSection>
      <Card className="flex items-center justify-between border-primary-200 bg-primary-50">
        <span className="text-sm font-semibold text-ink-2">Total tax applied on invoices</span>
        <span className="text-xl font-extrabold text-primary-700">{Number(total.toFixed(3))}%</span>
      </Card>
    </FormLayout>
  );
}
