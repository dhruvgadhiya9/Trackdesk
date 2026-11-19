"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Send } from "lucide-react";
import { Avatar, Badge, Button, Card } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Ticket } from "@/lib/mock";

interface Msg {
  id: number;
  from: "support" | "me";
  text: string;
  time: string;
}

function SupportChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "support", text: "Hi Sarah, engineering shipped the tax fix. Can you regenerate INV-4471 and confirm?", time: "10:02" },
    { id: 2, from: "me", text: "Done — 8.25% is applied now. Thank you!", time: "10:06" },
  ]);
  const [draft, setDraft] = useState("");
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: m.length + 1, from: "me", text: draft.trim(), time }]);
    setDraft("");
  };
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar name="Ryan Cole" />
        <div className="flex flex-1 flex-col">
          <span className="text-base font-bold text-ink">Chat With Support</span>
          <span className="text-xs text-muted">Ryan Cole · TrackDesk Support</span>
        </div>
        <Badge tone="success" dot>Online</Badge>
      </div>
      <ol aria-live="polite" className="m-0 flex max-h-80 list-none flex-col gap-3 overflow-y-auto p-0">
        {messages.map((m) => (
          <li key={m.id} className={m.from === "me" ? "self-end" : "self-start"}>
            <div className={m.from === "me" ? "rounded-lg rounded-br-sm bg-primary-600 px-3.5 py-2.5 text-sm text-white" : "rounded-lg rounded-bl-sm bg-surface-3 px-3.5 py-2.5 text-sm text-ink-2"}>
              {m.text}
            </div>
            <span className="mt-1 block text-xs text-muted">{m.time}</span>
          </li>
        ))}
      </ol>
      <form onSubmit={send} className="flex gap-2">
        <label htmlFor="support-msg" className="sr-only">Message</label>
        <input
          id="support-msg"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message TrackDesk support…"
          className="h-[42px] min-w-0 flex-1 rounded-md border border-line bg-surface px-3.5 text-sm outline-none focus:border-primary-600"
        />
        <Button type="submit" aria-label="Send message" className="px-3"><Send aria-hidden="true" className="size-4" /></Button>
      </form>
    </Card>
  );
}

export default function SupportPage() {
  return (
    <ListScreen<Ticket>
      crumbs={["Home", "Insights", "Support Center"]}
      title="Support Center"
      subtitle="Raise tickets and chat with the TrackDesk support team."
      entity="Ticket"
      canDelete={false}
      headerActions={<Button>Create Ticket</Button>}
      load={api.tickets}
      columns={[
        { key: "no", header: "Ticket Number", render: (t) => <span className="font-semibold text-primary-700">{t.number}</span> },
        { key: "subject", header: "Subject", render: (t) => t.subject },
        { key: "priority", header: "Priority", render: (t) => <StatusBadge status={t.priority} /> },
        { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
        { key: "updated", header: "Updated", render: (t) => t.updated },
      ]}
      aside={<SupportChat />}
    />
  );
}
