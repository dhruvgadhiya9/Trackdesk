"use client";

import { useState } from "react";
import { FileDown, Plus, Trash2 } from "lucide-react";
import { Button, Card, CardHeader } from "@trackdesk/ui";
import { FormLayout, FormSection } from "@/components/FormLayout";
import { InfoItem } from "@/components/InfoItem";
import { quoteLineItems, type LineItem } from "@/lib/ops-mock";

const TAX_RATE = 0.0825;
const DISCOUNT_PCT = 0.2;
const DISCOUNT_MAX = 60;
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const cell = "h-9 w-full rounded-md border border-line bg-surface px-2 text-sm text-ink focus:border-primary-600 focus:outline-none";

export default function QuoteEditPage() {
  const [items, setItems] = useState<LineItem[]>(quoteLineItems);
  const update = (id: number, patch: Partial<LineItem>) => setItems((s) => s.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  // Discount (WINTER20: 20% capped at $60) applies to the subtotal; tax is charged on taxable lines after a
  // proportional share of the discount. Final rules belong in the backend pricing service.
  const subtotal = items.reduce((a, i) => a + i.qty * i.unitCost, 0);
  const taxableBase = items.filter((i) => i.taxable).reduce((a, i) => a + i.qty * i.unitCost, 0);
  const discount = Math.min(subtotal * DISCOUNT_PCT, DISCOUNT_MAX);
  const taxableAfterDiscount = subtotal ? taxableBase - discount * (taxableBase / subtotal) : 0;
  const tax = Math.round(taxableAfterDiscount * TAX_RATE * 100) / 100;
  const total = subtotal - discount + tax;

  return (
    <FormLayout
      crumbs={["Home", "Quotations", "Create"]}
      title="Create Quotation · QT-5512"
      cancelHref="/ops/quotes"
      submitLabel="Send for Approval"
      extraActions={
        <>
          <Button type="submit" variant="secondary">Save Draft</Button>
          <Button variant="secondary" icon={<FileDown aria-hidden="true" className="size-4" />} disabled title="PDF generation needs the backend">Generate PDF</Button>
        </>
      }
    >
      <FormSection step={1} title="Customer Details" subtitle="Auto-filled from the job and the technician’s submitted quotation checklist.">
        <dl className="m-0 grid gap-5 sm:col-span-2 sm:grid-cols-4">
          <InfoItem label="Customer">Emily Johnson</InfoItem>
          <InfoItem label="Property">Riverside Office</InfoItem>
          <InfoItem label="Job">JOB-1048 · AC Repair</InfoItem>
          <InfoItem label="Checklist">HVAC Installation Assessment</InfoItem>
        </dl>
      </FormSection>
      <FormSection step={2} title="Line Items" columns={1}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <caption className="sr-only">Quotation line items</caption>
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-muted">
                <th scope="col" className="pb-2">Service / Item</th>
                <th scope="col" className="w-20 pb-2">Qty</th>
                <th scope="col" className="w-28 pb-2">Unit Cost</th>
                <th scope="col" className="w-20 pb-2">Tax</th>
                <th scope="col" className="w-28 pb-2 text-right">Amount</th>
                <th scope="col" className="w-12 pb-2"><span className="sr-only">Remove</span></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={i.id} className="border-t border-line-soft">
                  <td className="py-2 pr-2"><input aria-label={`Item ${idx + 1}`} className={cell} value={i.item} required onChange={(e) => update(i.id, { item: e.target.value })} /></td>
                  <td className="py-2 pr-2"><input aria-label={`Quantity ${idx + 1}`} type="number" min={1} className={cell} value={i.qty} onChange={(e) => update(i.id, { qty: Math.max(0, Number(e.target.value)) })} /></td>
                  <td className="py-2 pr-2"><input aria-label={`Unit cost ${idx + 1}`} type="number" min={0} step="0.01" className={cell} value={i.unitCost} onChange={(e) => update(i.id, { unitCost: Math.max(0, Number(e.target.value)) })} /></td>
                  <td className="py-2 pr-2 text-sm">
                    <label className="inline-flex items-center gap-1.5"><input type="checkbox" className="accent-primary-600" checked={i.taxable} onChange={(e) => update(i.id, { taxable: e.target.checked })} />{i.taxable ? "8.25%" : "—"}</label>
                  </td>
                  <td className="py-2 text-right text-sm font-semibold text-ink">{money(i.qty * i.unitCost)}</td>
                  <td className="py-2 text-right">
                    <Button variant="ghost" size="sm" className="size-9 px-0" aria-label={`Remove item ${idx + 1}`} onClick={() => setItems((s) => s.filter((x) => x.id !== i.id))}>
                      <Trash2 aria-hidden="true" className="size-4 text-danger-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="secondary" className="border-dashed" icon={<Plus aria-hidden="true" className="size-4" />} onClick={() => setItems((s) => [...s, { id: Date.now(), item: "", qty: 1, unitCost: 0, taxable: true }])}>
          Add Line Item
        </Button>
      </FormSection>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Summary" />
          <dl className="m-0 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-ink-3">Subtotal</dt><dd className="m-0 font-semibold text-ink">{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-3">Discount · WINTER20 (max $60)</dt><dd className="m-0 font-semibold text-success-700">−{money(discount)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-3">Tax · Dallas County 8.25%</dt><dd className="m-0 font-semibold text-ink">{money(tax)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2.5 text-base"><dt className="font-bold text-ink">Total</dt><dd className="m-0 font-extrabold text-primary-700">{money(total)}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Quotation Log" />
          <ol className="m-0 flex list-none flex-col gap-3 p-0 text-sm">
            <li><span className="font-semibold text-ink">Created by Marcus Reed</span><span className="block text-xs text-muted">19 Nov, 10:02 · v1</span></li>
            <li><span className="font-semibold text-ink">Updated by Marcus Reed</span><span className="block text-xs text-muted">19 Nov, 10:40 · v2 — added copper pipe</span></li>
          </ol>
        </Card>
      </div>
    </FormLayout>
  );
}
