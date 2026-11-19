"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import clsx from "clsx";
import { MapPin, Paperclip, Send } from "lucide-react";
import { Avatar, Badge, Button, Card, PageHeader, Tabs } from "@trackdesk/ui";
import { chats as seed, type ChatThread } from "@/lib/mock";

const kinds = ["Technician", "Company"] as const;

export default function MessagesPage() {
  const [threads, setThreads] = useState<ChatThread[]>(seed);
  const [kind, setKind] = useState<(typeof kinds)[number]>("Technician");
  const [activeId, setActiveId] = useState(seed[0]!.id);
  const [draft, setDraft] = useState("");
  const list = threads.filter((t) => t.kind === kind);
  const active = threads.find((t) => t.id === activeId && t.kind === kind) ?? list[0];

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setThreads((s) => s.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, { id: t.messages.length + 1, from: "me", text: draft.trim(), time }] } : t)));
    setDraft("");
  };

  return (
    <>
      <PageHeader crumbs={["Home", "Messages"]} title="Messages" subtitle="Chat with your technician or the company (text, photos, files and support tickets)." />
      <div className="grid min-h-[480px] gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="flex flex-col gap-2">
          <Tabs label="Conversation type" tabs={kinds} value={kind} onChange={setKind} />
          <ul className="m-0 flex list-none flex-col p-0">
            {list.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(t.id);
                    setThreads((s) => s.map((x) => (x.id === t.id ? { ...x, unread: false } : x)));
                  }}
                  aria-current={active?.id === t.id ? "true" : undefined}
                  className={clsx("flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 p-3 text-left", active?.id === t.id ? "bg-primary-50" : "bg-transparent hover:bg-surface-2")}
                >
                  <Avatar name={t.name} size="sm" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-bold text-ink">{t.name}</span>
                    <span className="truncate text-xs text-muted">{t.preview}</span>
                  </span>
                  {t.unread && <Badge tone="primary" dot>New</Badge>}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        {active && (
          <Card padded={false} className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-line-soft px-5 py-4">
              <Avatar name={active.name} />
              <div className="flex flex-col">
                <span className="text-base font-bold text-ink">{active.name}</span>
                <span className="text-xs text-muted">{active.subtitle}</span>
              </div>
            </div>
            <ol aria-live="polite" className="m-0 flex flex-1 list-none flex-col gap-3 overflow-y-auto p-5">
              {active.messages.map((m) => (
                <li key={m.id} className={clsx("max-w-[75%]", m.from === "me" ? "self-end" : "self-start")}>
                  <div className={m.from === "me" ? "rounded-lg rounded-br-sm bg-primary-600 px-3.5 py-2.5 text-sm text-white" : "rounded-lg rounded-bl-sm bg-surface-3 px-3.5 py-2.5 text-sm text-ink"}>
                    {m.text}
                    {m.attachment && (
                      <span className="mt-2 flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-ink">
                        <MapPin aria-hidden="true" className="size-3.5" />
                        {m.attachment}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 block text-xs text-muted">{m.time}</span>
                </li>
              ))}
            </ol>
            <form onSubmit={send} className="flex gap-2 border-t border-line-soft p-4">
              <Button variant="secondary" aria-label="Attach file" className="px-3">
                <Paperclip aria-hidden="true" className="size-4" />
              </Button>
              <label htmlFor="cu-msg" className="sr-only">Message</label>
              <input
                id="cu-msg"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${active.name.split(" ")[0]}…`}
                className="h-[42px] min-w-0 flex-1 rounded-md border border-line bg-surface px-3.5 text-sm outline-none focus:border-primary-600"
              />
              <Button type="submit" aria-label="Send message" className="px-3">
                <Send aria-hidden="true" className="size-4" />
              </Button>
            </form>
          </Card>
        )}
      </div>
    </>
  );
}
