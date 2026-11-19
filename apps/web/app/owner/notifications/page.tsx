"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Card, CardHeader, DataTable, PageHeader, Tabs } from "@trackdesk/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { notificationTemplates, sendHistory } from "@/lib/mock";

const channels = ["SMS", "Email", "Push"] as const;

function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{[a-z_]+\})/g).map((part, i) =>
        /^\{[a-z_]+\}$/.test(part) ? <code key={i} className="rounded bg-primary-50 px-1 font-semibold text-primary-700">{part}</code> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

export default function NotificationsPage() {
  const [channel, setChannel] = useState<(typeof channels)[number]>("SMS");
  const templates = notificationTemplates.filter((t) => t.channel === channel);
  return (
    <>
      <PageHeader crumbs={["Home", "Insights", "Notification Center"]} title="Notification Center" subtitle="SMS, email and web push templates with delivery status." />
      <Tabs label="Channel" tabs={channels} value={channel} onChange={setChannel} />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Templates" actions={<Button size="sm" icon={<Plus aria-hidden="true" className="size-3.5" />}>New Template</Button>} />
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {templates.length === 0 && <li className="text-sm text-muted">No {channel} templates yet.</li>}
            {templates.map((t) => (
              <li key={t.id} className="rounded-lg border border-line bg-surface-2 p-4">
                <p className="m-0 text-sm font-bold text-ink">{t.name}</p>
                <p className="m-0 mt-1 text-sm leading-relaxed text-ink-3"><Highlight text={t.body} /></p>
              </li>
            ))}
          </ul>
        </Card>
        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-base font-bold text-ink">Send History</h2>
          <DataTable
            caption="Send history"
            rows={sendHistory}
            rowKey={(s) => s.id}
            columns={[
              { key: "sent", header: "Sent", render: (s) => s.sent },
              { key: "to", header: "To", render: (s) => s.to },
              { key: "tpl", header: "Template", render: (s) => s.template },
              { key: "status", header: "Delivery Status", render: (s) => <StatusBadge status={s.status} /> },
            ]}
          />
        </div>
      </div>
    </>
  );
}
