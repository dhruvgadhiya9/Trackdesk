"use client";

import type { DragEvent } from "react";
import { useState } from "react";
import clsx from "clsx";
import { Info } from "lucide-react";
import { Avatar, Button, FilterSelect, PageHeader, Tabs } from "@trackdesk/ui";
import { schedule as seed, technicians, weekDays, type ScheduleItem } from "@/lib/ops-mock";

const views = ["Daily", "Weekly", "Monthly"] as const;

export default function CalendarPage() {
  const [view, setView] = useState<(typeof views)[number]>("Weekly");
  const [items, setItems] = useState<ScheduleItem[]>(seed);
  const [tech, setTech] = useState("All");
  const [dragId, setDragId] = useState<string | null>(null);
  const [note, setNote] = useState<string>();
  const rows = technicians.filter((t) => (tech === "All" || t.name === tech) && items.some((i) => i.technician === t.name));

  const drop = (e: DragEvent, technician: string, day: number) => {
    e.preventDefault();
    if (!dragId) return;
    const it = items.find((i) => i.id === dragId);
    setItems((s) => s.map((i) => (i.id === dragId ? { ...i, technician, day } : i)));
    if (it) setNote(`${it.job} moved to ${technician} · ${weekDays[day]}.`);
    setDragId(null);
  };

  return (
    <>
      <PageHeader
        crumbs={["Home", "Requests", "Scheduling"]}
        title="Scheduling Calendar"
        subtitle="Manage technician schedules · 16 – 22 Nov 2026"
        actions={
          <>
            <Button variant="secondary">Assign Technician</Button>
            <Button>Create Job</Button>
          </>
        }
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <Tabs label="Calendar view" tabs={views} value={view} onChange={setView} />
        <FilterSelect label="Technician" options={["All", ...technicians.map((t) => t.name)]} value={tech} onChange={setTech} />
      </div>
      {note && <p role="status" className="m-0 text-sm font-semibold text-success-700">{note}</p>}
      <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-table">
        <table className="w-full min-w-[960px] table-fixed border-collapse">
          <caption className="sr-only">Weekly technician schedule</caption>
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="w-48 border-b border-line-soft px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted">Technician</th>
              {weekDays.map((d) => (
                <th key={d} scope="col" className="border-b border-l border-line-soft px-2 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-line-soft last:border-0">
                <th scope="row" className="px-4 py-3 text-left">
                  <span className="flex items-center gap-2.5"><Avatar name={t.name} size="sm" /><span className="text-sm font-semibold text-ink">{t.name}</span></span>
                </th>
                {weekDays.map((_, day) => (
                  <td
                    key={day}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => drop(e, t.name, day)}
                    className={clsx("h-20 border-l border-line-soft p-1.5 align-top", dragId && "bg-primary-50/40")}
                  >
                    {items
                      .filter((i) => i.technician === t.name && i.day === day)
                      .map((i) => (
                        <div
                          key={i.id}
                          draggable
                          onDragStart={() => setDragId(i.id)}
                          onDragEnd={() => setDragId(null)}
                          className={clsx(
                            "mb-1 cursor-grab rounded-md border-l-4 px-2 py-1.5 text-xs",
                            i.service === "On Hold" ? "border-warning-500 bg-warning-50" : "border-primary-600 bg-primary-50",
                          )}
                        >
                          <span className="block font-bold text-ink">{i.job}</span>
                          <span className="block text-ink-3">{i.service}</span>
                          <span className="block text-muted">{i.time}</span>
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="m-0 flex items-center gap-2 text-sm text-muted">
        <Info aria-hidden="true" className="size-4" />
        Drag & drop a job card to another day or technician to reschedule.
      </p>
    </>
  );
}
