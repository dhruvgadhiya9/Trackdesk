"use client";

import { useState } from "react";
import { TextField, Toggle } from "@trackdesk/ui";
import { ChoiceGroup, FormLayout, FormSection } from "@/components/FormLayout";

export default function CustomerEditPage() {
  const [type, setType] = useState<"Individual" | "Business">("Individual");
  const [portal, setPortal] = useState(true);
  return (
    <FormLayout crumbs={["Home", "Customers", "Add Customer"]} title="Add Customer" cancelHref="/owner/customers" submitLabel="Save Customer">
      <FormSection step={1} title="Basic Information" columns={1}>
        <ChoiceGroup label="Customer Type" options={["Individual", "Business"] as const} value={type} onChange={setType} />
      </FormSection>
      <FormSection step={2} title="Customer Details">
        <TextField label={type === "Business" ? "Company Name" : "Name"} name="name" required />
        {type === "Business" && <TextField label="Contact Person" name="contact" required />}
        <TextField label="Email" name="email" type="email" required />
        <TextField label="Mobile" name="mobile" type="tel" required />
        <TextField label="Address" name="address" required className="sm:col-span-2" />
        <TextField label="Billing Address" name="billing" placeholder="Same as address" className="sm:col-span-2" />
      </FormSection>
      <FormSection step={3} title="Portal Access" columns={1}>
        <Toggle label="Enable Login" description="A secure login link is emailed to the customer" checked={portal} onChange={setPortal} />
      </FormSection>
    </FormLayout>
  );
}
