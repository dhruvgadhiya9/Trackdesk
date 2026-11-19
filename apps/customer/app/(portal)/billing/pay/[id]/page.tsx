import { notFound } from "next/navigation";
import { invoices } from "@/lib/mock";
import { PayInvoice } from "./PayInvoice";

export function generateStaticParams() {
  return invoices.filter((i) => i.status === "Unpaid").map((i) => ({ id: i.id }));
}

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = invoices.find((i) => i.id === id);
  if (!invoice || invoice.status !== "Unpaid") notFound();
  return <PayInvoice invoice={invoice} />;
}
