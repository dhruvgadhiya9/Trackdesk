"use client";

import { useState } from "react";
import { SelectField, TextAreaField, TextField } from "@trackdesk/ui";
import { ChoiceGroup, FormLayout, FormSection } from "@/components/FormLayout";
import { customers } from "@/lib/mock";

const types = ["Home", "Office", "Factory", "Warehouse"] as const;

export default function PropertyEditPage() {
  const [type, setType] = useState<(typeof types)[number]>("Office");
  return (
    <FormLayout crumbs={["Home", "Properties", "Add Property"]} title="Add Property" cancelHref="/owner/properties" submitLabel="Save Property">
      <FormSection step={1} title="Property Information">
        <SelectField label="Customer" name="customer" required options={customers.map((c) => c.name)} />
        <TextField label="Property Name" name="name" required />
        <ChoiceGroup label="Property Type" options={types} value={type} onChange={setType} className="sm:col-span-2" />
      </FormSection>
      <FormSection step={2} title="Address">
        <TextField label="Country" name="country" required defaultValue="United States" />
        <TextField label="State" name="state" required />
        <TextField label="City" name="city" required />
        <TextField label="Address" name="address" required />
      </FormSection>
      <FormSection step={3} title="Additional Information" columns={1}>
        <TextAreaField label="Property Notes" name="notes" placeholder="Access instructions, gate codes, equipment location…" />
      </FormSection>
    </FormLayout>
  );
}
