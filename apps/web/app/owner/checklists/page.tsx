"use client";

import { useState } from "react";
import { Copy, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardHeader, DataTable, PageHeader, SelectField, TextField } from "@trackdesk/ui";
import { checklists as seed, type Checklist, type ChecklistItem } from "@/lib/mock";

const inputTypes = ["Text", "Number", "Pass / Fail", "Yes / No", "Photo required"];

export default function ChecklistsPage() {
  const [lists, setLists] = useState<Checklist[]>(seed);
  const [selectedId, setSelectedId] = useState(seed[0]!.id);
  const [saved, setSaved] = useState(false);
  const selected = lists.find((l) => l.id === selectedId)!;

  const updateItems = (fn: (items: ChecklistItem[]) => ChecklistItem[]) => {
    setSaved(false);
    setLists((ls) => ls.map((l) => (l.id === selectedId ? { ...l, items: fn(l.items) } : l)));
  };
  const create = () => {
    const id = `cl${Date.now()}`;
    setLists((ls) => [...ls, { id, name: "New Checklist", category: "HVAC", type: "Service", servicesMapped: 0, autoAssigned: "—", items: [] }]);
    setSelectedId(id);
  };
  const clone = () => {
    const id = `cl${Date.now()}`;
    setLists((ls) => [...ls, { ...selected, id, name: `${selected.name} (copy)` }]);
    setSelectedId(id);
  };

  return (
    <>
      <PageHeader
        crumbs={["Home", "Services", "Checklist Builder"]}
        title="Checklist Builder"
        subtitle="Dynamic service and quotation checklists, auto-assigned by service type."
        actions={<Button icon={<Plus aria-hidden="true" className="size-4" />} onClick={create}>Create Checklist</Button>}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <DataTable
          caption="Checklists"
          rows={lists}
          rowKey={(l) => l.id}
          onRowClick={(l) => setSelectedId(l.id)}
          columns={[
            { key: "name", header: "Checklist Name", render: (l) => <span className={l.id === selectedId ? "font-bold text-primary-700" : "font-semibold text-ink"}>{l.name}</span> },
            { key: "cat", header: "Category", render: (l) => l.category },
            { key: "type", header: "Type", render: (l) => <Badge tone={l.type === "Service" ? "primary" : "violet"}>{l.type}</Badge> },
            { key: "mapped", header: "Services Mapped", render: (l) => l.servicesMapped },
          ]}
        />
        <Card>
          <CardHeader
            title={selected.name}
            subtitle={`Auto-assigned to: ${selected.autoAssigned}`}
            actions={
              <>
                <Button variant="secondary" size="sm" icon={<Copy aria-hidden="true" className="size-3.5" />} onClick={clone}>Clone</Button>
                <Button size="sm" icon={<Save aria-hidden="true" className="size-3.5" />} onClick={() => setSaved(true)}>{saved ? "Saved" : "Save"}</Button>
              </>
            }
          />
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {selected.items.map((item, i) => (
              <li key={i} className="flex flex-wrap items-end gap-3 rounded-lg border border-line bg-surface-2 p-3">
                <GripVertical aria-hidden="true" className="mb-3 size-4 text-subtle" />
                <span className="mb-3 text-sm font-bold text-muted">{i + 1}.</span>
                <TextField label="Item" value={item.label} className="min-w-[160px] flex-1" onChange={(e) => updateItems((it) => it.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                <SelectField label="Input" options={inputTypes.includes(item.input) ? inputTypes : [item.input, ...inputTypes]} value={item.input} className="w-40" onChange={(e) => updateItems((it) => it.map((x, j) => (j === i ? { ...x, input: e.target.value } : x)))} />
                <label className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-ink-2">
                  <input type="checkbox" className="size-4 accent-primary-600" checked={item.required} onChange={(e) => updateItems((it) => it.map((x, j) => (j === i ? { ...x, required: e.target.checked } : x)))} />
                  Required
                </label>
                <Button variant="ghost" size="sm" className="mb-1 size-9 px-0" aria-label={`Remove item ${i + 1}`} onClick={() => updateItems((it) => it.filter((_, j) => j !== i))}>
                  <Trash2 aria-hidden="true" className="size-4 text-danger-600" />
                </Button>
              </li>
            ))}
          </ol>
          <Button variant="secondary" className="mt-4 w-full border-dashed" icon={<Plus aria-hidden="true" className="size-4" />} onClick={() => updateItems((it) => [...it, { label: "", input: "Text", required: false }])}>
            Add Checklist Item
          </Button>
        </Card>
      </div>
    </>
  );
}
