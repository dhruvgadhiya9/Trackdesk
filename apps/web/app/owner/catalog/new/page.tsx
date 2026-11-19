"use client";

import { useState } from "react";
import { SelectField, TextAreaField, TextField, Toggle } from "@trackdesk/ui";
import { FormLayout, FormSection } from "@/components/FormLayout";
import { checklists } from "@/lib/mock";

const categories = ["HVAC", "Plumbing", "Electrical", "Solar", "Cleaning", "Facilities"];

export default function ServiceEditPage() {
  const [emergency, setEmergency] = useState(true);
  const [quotation, setQuotation] = useState(false);
  return (
    <FormLayout crumbs={["Home", "Service Catalog", "Add Service"]} title="Add Service" cancelHref="/owner/catalog" submitLabel="Save Service">
      <FormSection step={1} title="Basic Information">
        <TextField label="Service Name" name="name" required />
        <SelectField label="Category" name="category" required options={categories} />
        <TextField label="Short Description" name="short" className="sm:col-span-2" />
        <TextAreaField label="Description" name="description" className="sm:col-span-2" />
      </FormSection>
      <FormSection step={2} title="Pricing" subtitle="Emergency Service = Standard Charges + Emergency Charges">
        <TextField label="Standard Price ($)" name="price" type="number" min={0} step="0.01" required disabled={quotation} />
        <TextField label="Emergency Price ($)" name="emergencyPrice" type="number" min={0} step="0.01" required={emergency && !quotation} disabled={!emergency || quotation} />
        <Toggle label="Emergency Service Available" description="Customers can request this as an emergency" checked={emergency} onChange={setEmergency} />
      </FormSection>
      <FormSection step={3} title="Settings" columns={1}>
        <Toggle label="Enable Quotation Required" description="Price is set per job via a quotation" checked={quotation} onChange={setQuotation} />
      </FormSection>
      <FormSection step={4} title="Checklist Mapping" subtitle="Automatically assigned to jobs of this service type.">
        <SelectField label="Service Checklist" name="checklist" required options={checklists.filter((c) => c.type === "Service").map((c) => c.name)} />
        <SelectField label="Quotation Checklist" name="quoteChecklist" options={["None", ...checklists.filter((c) => c.type === "Quotation").map((c) => c.name)]} />
      </FormSection>
    </FormLayout>
  );
}
