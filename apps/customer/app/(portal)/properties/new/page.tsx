"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button, buttonClass, ChoiceGroup, FormSection, PageHeader, SelectField, TextAreaField, TextField } from "@trackdesk/ui";

const categories = ["Residential", "Commercial", "Industrial"] as const;

export default function AddPropertyPage() {
  const router = useRouter();
  const [category, setCategory] = useState<(typeof categories)[number]>("Residential");
  const [saving, setSaving] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setSaving(true);
    setTimeout(() => router.push("/properties"), 400); // mock save
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <PageHeader crumbs={["Home", "Properties", "Add Property"]} title="Add Property" />
      <FormSection step={1} title="Property Information">
        <TextField label="Property Name" name="name" required />
        <SelectField label="Property Type" name="type" required options={["Home", "Office", "Factory", "Warehouse"]} />
        <ChoiceGroup label="Property Category" options={categories} value={category} onChange={setCategory} className="sm:col-span-2" />
      </FormSection>
      <FormSection step={2} title="Address Information" columns={3}>
        <TextField label="Street Address" name="street" required className="sm:col-span-2 lg:col-span-3" autoComplete="street-address" />
        <TextField label="City" name="city" required autoComplete="address-level2" />
        <TextField label="State" name="state" required autoComplete="address-level1" />
        <TextField label="Postal Code" name="postal" required autoComplete="postal-code" />
      </FormSection>
      <FormSection step={3} title="Additional Information">
        <TextField label="Landmark" name="landmark" />
        <TextAreaField label="Access Instructions" name="access" placeholder="Parking, keys, gate codes…" />
      </FormSection>
      <div className="flex justify-end gap-2.5">
        <Link href="/properties" className={buttonClass("secondary")}>Cancel</Link>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
      </div>
    </form>
  );
}
