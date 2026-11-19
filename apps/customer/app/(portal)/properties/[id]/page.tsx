import { notFound } from "next/navigation";
import { properties } from "@/lib/mock";
import { PropertyDetails } from "./PropertyDetails";

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);
  if (!property) notFound();
  return <PropertyDetails property={property} />;
}
