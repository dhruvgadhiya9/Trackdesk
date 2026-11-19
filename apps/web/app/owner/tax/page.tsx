"use client";

import { Card, CardHeader } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { api } from "@/lib/api";
import type { TaxRule } from "@/lib/mock";

const usTree = `USA
└── Texas
    └── Dallas County
        ├── Labor Taxable = Yes
        ├── Material Taxable = Yes
        ├── HVAC Taxable = Yes
        └── Tax = 8.25%`;
const caTree = `Canada
└── Quebec
    ├── GST = 5%
    ├── QST = 9.975%
    └── Total = 14.975%`;

export default function TaxPage() {
  return (
    <ListScreen<TaxRule>
      crumbs={["Home", "Services", "Tax Master"]}
      title="Tax Master"
      subtitle="US sales tax, UK VAT and Canada GST / PST / HST / QST rules."
      entity="Tax Rule"
      createHref="/owner/tax/new"
      editHref={() => "/owner/tax/new"}
      tabs={{ label: "Country", get: (t) => t.country, values: ["All", "USA", "UK", "Canada"] }}
      load={api.taxRules}
      search={{ placeholder: "Search region or tax type…", text: (t) => `${t.region} ${t.taxType}` }}
      columns={[
        { key: "country", header: "Country", render: (t) => <span className="font-semibold text-ink">{t.country}</span> },
        { key: "region", header: "Region", render: (t) => t.region },
        { key: "type", header: "Tax Type", render: (t) => t.taxType },
        { key: "applies", header: "Applies To", render: (t) => t.appliesTo },
        { key: "rate", header: "Tax %", align: "right", render: (t) => <span className="font-bold text-ink">{t.rate}</span> },
        { key: "eff", header: "Effective", render: (t) => t.effective },
      ]}
      aside={
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="US hierarchy" subtitle="Country → State → Jurisdiction → Rules" />
            <pre className="m-0 overflow-x-auto rounded-lg bg-surface-2 p-4 text-sm text-ink-2">{usTree}</pre>
          </Card>
          <Card>
            <CardHeader title="Canada hierarchy" subtitle="Country → Province → Tax Type → Rules" />
            <pre className="m-0 overflow-x-auto rounded-lg bg-surface-2 p-4 text-sm text-ink-2">{caTree}</pre>
          </Card>
        </div>
      }
    />
  );
}
