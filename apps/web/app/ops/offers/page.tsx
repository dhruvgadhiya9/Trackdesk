"use client";

import { useState } from "react";
import { TextAreaField, TextField } from "@trackdesk/ui";
import { ChoiceGroup, FormSection } from "@/components/FormLayout";
import { ListScreen } from "@/components/ListScreen";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { BranchOffer } from "@/lib/ops-mock";
import { Button } from "@trackdesk/ui";

const types = ["Discount %", "Fixed Amount", "Free Service"] as const;
const limits = ["Unlimited", "One-Time Use Only", "Custom Limit"] as const;
const scopes = ["Specific Service Categories", "Specific Services", "Entire Branch"] as const;

export default function BranchOffersPage() {
  const [type, setType] = useState<(typeof types)[number]>("Discount %");
  const [limit, setLimit] = useState<(typeof limits)[number]>("One-Time Use Only");
  const [scope, setScope] = useState<(typeof scopes)[number]>("Specific Service Categories");
  const [status, setStatus] = useState<string>();
  return (
    <>
      <ListScreen<BranchOffer>
        crumbs={["Home", "Growth", "Branch Offers"]}
        title="Branch Offer Management"
        subtitle="Branch-level offers with usage limits per customer."
        entity="Offer"
        load={api.branchOffers}
        columns={[
          { key: "name", header: "Offer Name", render: (o) => <span className="font-semibold text-ink">{o.name}</span> },
          { key: "type", header: "Offer Type", render: (o) => o.type },
          { key: "branch", header: "Branch", render: (o) => o.branch },
          { key: "from", header: "Valid From", render: (o) => o.from },
          { key: "to", header: "Valid To", render: (o) => o.to },
          { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
        ]}
      />
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
          setStatus(submitter?.value === "publish" ? "Offer published." : "Draft saved.");
        }}
      >
        <h2 className="m-0 text-lg font-extrabold text-ink">Create Offer</h2>
        <FormSection title="Offer Details">
          <TextField label="Offer Name" name="name" required />
          <TextField label="Branch" name="branch" required defaultValue="Dallas HQ" readOnly />
          <TextAreaField label="Offer Description" name="description" className="sm:col-span-2" />
        </FormSection>
        <FormSection title="Offer Rules & Usage Limits">
          <ChoiceGroup label="Offer Type" options={types} value={type} onChange={setType} className="sm:col-span-2" />
          {type !== "Free Service" && (
            <TextField label={type === "Discount %" ? "Discount %" : "Amount ($)"} name="value" type="number" min={0} required />
          )}
          <TextField label="Maximum Total Redemptions" name="max" type="number" min={1} />
          <ChoiceGroup label="Limit Per Customer" options={limits} value={limit} onChange={setLimit} className="sm:col-span-2" />
        </FormSection>
        <FormSection title="Validity & Assignment">
          <TextField label="Start Date" name="start" type="date" required />
          <TextField label="End Date" name="end" type="date" required />
          <ChoiceGroup label="Assign Offer To" options={scopes} value={scope} onChange={setScope} className="sm:col-span-2" />
        </FormSection>
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {status && <span role="status" className="mr-auto text-sm font-semibold text-success-700">{status}</span>}
          <Button type="reset" variant="secondary">Cancel</Button>
          <Button type="submit" variant="secondary" value="draft">Save</Button>
          <Button type="submit" value="publish">Publish</Button>
        </div>
      </form>
    </>
  );
}
