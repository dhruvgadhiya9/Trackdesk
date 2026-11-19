"use client";

import { useState } from "react";
import { Button, Card, TextField } from "@trackdesk/ui";
import { ChoiceGroup, FormLayout, FormSection } from "@/components/FormLayout";

const types = ["Percentage", "Flat", "Coupon", "Free Inspection", "Bundle Offer"] as const;

export default function OfferCreatePage() {
  const [type, setType] = useState<(typeof types)[number]>("Percentage");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [value, setValue] = useState("20");
  const [max, setMax] = useState("60.00");
  const [min, setMin] = useState("100.00");
  const discount = type === "Percentage" ? `${value || 0}% off` : type === "Flat" ? `$${value || 0} off` : type;
  return (
    <FormLayout
      crumbs={["Home", "Offers", "Create Offer"]}
      title="Create Offer"
      cancelHref="/owner/offers"
      submitLabel="Activate Offer"
      extraActions={<Button variant="secondary" type="submit">Save Draft</Button>}
    >
      <FormSection step={1} title="Basic Information">
        <TextField label="Offer Name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Offer Code" name="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <ChoiceGroup label="Offer Type" options={types} value={type} onChange={setType} className="sm:col-span-2" />
      </FormSection>
      <FormSection step={2} title="Configuration">
        <TextField label="Valid From" name="from" type="date" required />
        <TextField label="Valid To" name="to" type="date" required />
        <TextField label="Services" name="services" required placeholder="e.g. AC Servicing, AC Repair" />
        <TextField label="Branches" name="branches" required defaultValue="All branches" />
      </FormSection>
      <FormSection step={3} title="Discount Settings" columns={3}>
        <TextField label={type === "Percentage" ? "Discount Value (%)" : "Discount Value ($)"} name="value" type="number" min={0} required value={value} onChange={(e) => setValue(e.target.value)} />
        <TextField label="Max Discount ($)" name="max" type="number" min={0} step="0.01" value={max} onChange={(e) => setMax(e.target.value)} />
        <TextField label="Minimum Amount ($)" name="min" type="number" min={0} step="0.01" value={min} onChange={(e) => setMin(e.target.value)} />
      </FormSection>
      <Card className="border-primary-200 bg-primary-50">
        <h2 className="m-0 text-sm font-bold text-primary-700">Preview · {name || "Untitled offer"}</h2>
        <p className="m-0 mt-1 text-sm text-ink-2">
          {discount}, up to ${max || "0"}, on orders above ${min || "0"}.{code && ` Code ${code}.`}
        </p>
      </Card>
    </FormLayout>
  );
}
