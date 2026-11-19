"use client";

import { useState } from "react";
import { SelectField, TextAreaField, TextField } from "@trackdesk/ui";
import { Button } from "@trackdesk/ui";
import { ChoiceGroup, FormLayout, FormSection } from "@/components/FormLayout";
import { customers, properties, services } from "@/lib/mock";

const priorities = ["Emergency", "High", "Medium", "Low"] as const;

export default function OpsRequestCreatePage() {
  const [customer, setCustomer] = useState(customers[0]!.name);
  const [category, setCategory] = useState("HVAC");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("Medium");
  const props = properties.filter((p) => p.customer === customer);
  const cust = customers.find((c) => c.name === customer);
  return (
    <FormLayout
      crumbs={["Home", "Service Requests", "Create"]}
      title="Create Service Request"
      cancelHref="/ops/requests"
      submitLabel="Create Request"
      extraActions={<Button type="submit" variant="secondary">Save Draft</Button>}
    >
      <FormSection step={1} title="Customer Information">
        <SelectField label="Customer" name="customer" required options={customers.map((c) => c.name)} value={customer} onChange={(e) => setCustomer(e.target.value)} />
        <SelectField label="Property" name="property" required options={props.length ? props.map((p) => `${p.name} · ${p.address}`) : ["No properties — add one first"]} />
        <TextField label="Contact Person" name="contact" required key={`c-${customer}`} defaultValue={cust?.contact} />
        <TextField label="Mobile Number" name="mobile" type="tel" required key={`m-${customer}`} defaultValue={cust?.mobile} />
      </FormSection>
      <FormSection step={2} title="Service Information">
        <SelectField label="Service Category" name="category" required options={[...new Set(services.map((s) => s.category))]} value={category} onChange={(e) => setCategory(e.target.value)} />
        <SelectField label="Service Type" name="service" required options={services.filter((s) => s.category === category).map((s) => s.name)} />
        <TextAreaField label="Service Description" name="description" required className="sm:col-span-2" />
        <TextField label="Preferred Visit Date" name="visit" type="date" />
      </FormSection>
      <FormSection step={3} title="Priority" columns={1}>
        <ChoiceGroup label="Priority" options={priorities} value={priority} onChange={setPriority} />
      </FormSection>
    </FormLayout>
  );
}
