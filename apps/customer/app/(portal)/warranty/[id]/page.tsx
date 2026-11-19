import { notFound } from "next/navigation";
import { warranties } from "@/lib/mock";
import { Certificate } from "./Certificate";

export function generateStaticParams() {
  return warranties.map((w) => ({ id: w.id }));
}

export default async function WarrantyCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const warranty = warranties.find((w) => w.id === id);
  if (!warranty) notFound();
  return <Certificate warranty={warranty} />;
}
