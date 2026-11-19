"use client";

import { useState } from "react";
import { TextField } from "@trackdesk/ui";
import { CheckboxGroup, FormLayout, FormSection } from "@/components/FormLayout";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BranchEditPage() {
  const [working, setWorking] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  return (
    <FormLayout crumbs={["Home", "Branches", "Add Branch"]} title="Add Branch" cancelHref="/owner/branches" submitLabel="Save Branch">
      <FormSection step={1} title="Basic Information">
        <TextField label="Branch Name" name="name" required placeholder="e.g. Austin Central" />
        <TextField label="Branch Code" name="code" required placeholder="e.g. AUS-03" />
        <TextField label="Contact Number" name="phone" type="tel" required placeholder="(512) 555-0110" />
        <TextField label="Email" name="email" type="email" required placeholder="branch@company.com" />
        <TextField label="Country" name="country" required defaultValue="United States" />
        <TextField label="State" name="state" required />
        <TextField label="City" name="city" required />
        <TextField label="Zip Code" name="zip" required />
        <TextField label="Address" name="address" required className="sm:col-span-2" />
      </FormSection>
      <FormSection step={2} title="Operations">
        <TextField label="Branch Manager" name="manager" required />
        <CheckboxGroup label="Working Days" options={days} value={working} onChange={setWorking} />
        <TextField label="Opens at" name="opens" type="time" defaultValue="08:00" />
        <TextField label="Closes at" name="closes" type="time" defaultValue="18:00" />
      </FormSection>
    </FormLayout>
  );
}
