"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import clsx from "clsx";
import { ArrowUpCircle, Lock, Paperclip, Send, XCircle } from "lucide-react";
import { Avatar, Button, Card, CardHeader, PageHeader, SelectField, TextAreaField } from "@trackdesk/ui";
import { InfoItem } from "@/components/InfoItem";
import { StatusBadge } from "@/components/StatusBadge";
import { agents, type Ticket } from "@/lib/platform-mock";

interface Msg {
  id: number;
  from: "customer" | "agent";
  text: string;
  time: string;
  attachment?: string;
}

const seedMessages: Msg[] = [
  { id: 1, from: "customer", text: "Hi team, since this morning our invoices for Dallas County jobs show 0% tax. Quotations are fine. Can you check?", time: "09:12", attachment: "invoice-INV-4471.pdf" },
  { id: 2, from: "agent", text: "Thanks. I can reproduce it on INV-4471. Escalating to engineering — the Texas jurisdiction rule has an effective date in the future.", time: "09:20" },
  { id: 3, from: "customer", text: "Got it. We have 14 invoices due today, is there a workaround?", time: "09:24" },
  { id: 4, from: "agent", text: "Yes — edit the Dallas County rule effective date to 01 Nov 2026 and regenerate. Engineering fix ships tonight.", time: "09:31" },
];
const statuses = ["Open", "Pending", "Escalated", "Resolved", "Closed"];
const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export function TicketDetails({ ticket: t }: { ticket: Ticket }) {
  const [messages, setMessages] = useState<Msg[]>(
    t.id === "TCK-2291" ? seedMessages : [{ id: 1, from: "customer", text: t.description, time: t.created.split(", ")[1] ?? "" }],
  );
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<string>(t.status);
  const [agent, setAgent] = useState(t.agent);
  const [notes, setNotes] = useState(
    t.id === "TCK-2291" ? [{ who: "Ryan Cole", text: "Rule effective date set to 01 Dec by mistake during import.", time: "09:28" }] : [],
  );
  const [note, setNote] = useState("");

  const reply = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((m) => [...m, { id: m.length + 1, from: "agent", text: draft.trim(), time: now() }]);
    setDraft("");
  };

  return (
    <>
      <PageHeader crumbs={["Home", "Support Tickets", t.id]} title={`${t.id} · ${t.subject}`} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card padded={false} className="flex flex-col">
          <div className="border-b border-line-soft px-5 py-4">
            <h2 className="m-0 text-base font-bold text-ink">Conversation</h2>
            <p className="m-0 text-sm text-muted">Company Admin ↔ Support Agent</p>
          </div>
          <ol aria-live="polite" className="m-0 flex list-none flex-col gap-3 p-5">
            {messages.map((m) => (
              <li key={m.id} className={clsx("flex max-w-[80%] gap-2.5", m.from === "agent" ? "flex-row-reverse self-end" : "self-start")}>
                <Avatar name={m.from === "agent" ? agent : t.company} size="sm" />
                <div>
                  <div
                    className={
                      m.from === "agent"
                        ? "rounded-lg rounded-br-sm bg-primary-600 px-3.5 py-2.5 text-sm text-white"
                        : "rounded-lg rounded-bl-sm bg-surface-3 px-3.5 py-2.5 text-sm text-ink-2"
                    }
                  >
                    {m.text}
                    {m.attachment && (
                      <span className="mt-2 flex items-center gap-1.5 rounded-md bg-white/60 px-2 py-1 text-xs font-semibold text-ink-2">
                        <Paperclip aria-hidden="true" className="size-3.5" />
                        {m.attachment}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 block text-xs text-muted">{m.time}</span>
                </div>
              </li>
            ))}
          </ol>
          <form onSubmit={reply} className="flex gap-2 border-t border-line-soft p-4">
            <Button variant="secondary" aria-label="Attach file" className="px-3">
              <Paperclip aria-hidden="true" className="size-4" />
            </Button>
            <label htmlFor="ticket-reply" className="sr-only">
              Reply
            </label>
            <input
              id="ticket-reply"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Reply to the company admin…"
              className="h-[42px] min-w-0 flex-1 rounded-md border border-line bg-surface px-3.5 text-sm outline-none focus:border-primary-600"
            />
            <Button type="submit" aria-label="Send reply" className="px-3" disabled={status === "Closed"}>
              <Send aria-hidden="true" className="size-4" />
            </Button>
          </form>
        </Card>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Ticket Information" />
            <dl className="m-0 grid grid-cols-2 gap-4">
              <InfoItem label="Ticket ID">{t.id}</InfoItem>
              <InfoItem label="Company">{t.company}</InfoItem>
              <InfoItem label="Priority"><StatusBadge status={t.priority} /></InfoItem>
              <InfoItem label="Status"><StatusBadge status={status} /></InfoItem>
              <InfoItem label="Created">{t.created}</InfoItem>
              <InfoItem label="SLA Remaining">{t.sla}</InfoItem>
            </dl>
            <p className="m-0 mt-4 rounded-lg bg-surface-2 px-4 py-3 text-sm leading-relaxed text-ink-2">{t.description}</p>
          </Card>
          <Card>
            <CardHeader title="Internal Notes" subtitle="Visible only to the support team." />
            <ul className="m-0 mb-4 flex list-none flex-col gap-3 p-0">
              {notes.length === 0 && <li className="text-sm text-muted">No internal notes yet.</li>}
              {notes.map((n, i) => (
                <li key={i} className="rounded-lg bg-warning-50 px-3.5 py-2.5 text-sm text-ink-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-warning-700">
                    <Lock aria-hidden="true" className="size-3" />
                    {n.who} · Internal · {n.time}
                  </span>
                  {n.text}
                </li>
              ))}
            </ul>
            <TextAreaField label="Add internal note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              disabled={!note.trim()}
              onClick={() => {
                setNotes((s) => [...s, { who: "Daniel Carter", text: note.trim(), time: now() }]);
                setNote("");
              }}
            >
              Add note
            </Button>
          </Card>
          <Card>
            <CardHeader title="Actions" />
            <div className="flex flex-col gap-4">
              <SelectField
                label="Assign Agent"
                options={agents.filter((a) => a.status === "Active").map((a) => a.name)}
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
              />
              <SelectField label="Change Status" options={statuses} value={status} onChange={(e) => setStatus(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" icon={<ArrowUpCircle aria-hidden="true" className="size-4" />} disabled={status === "Escalated"} onClick={() => setStatus("Escalated")}>
                  Escalate
                </Button>
                <Button variant="danger" icon={<XCircle aria-hidden="true" className="size-4" />} disabled={status === "Closed"} onClick={() => setStatus("Closed")}>
                  Close Ticket
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
