import { notFound } from "next/navigation";
import { customers } from "@/lib/mock";
import { CustomerDetails } from "./CustomerDetails";

export function generateStaticParams() {
  return customers.map((c) => ({ id: c.id }));
}

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = customers.find((c) => c.id === id);
  if (!customer) notFound();
  return <CustomerDetails customer={customer} />;
}
