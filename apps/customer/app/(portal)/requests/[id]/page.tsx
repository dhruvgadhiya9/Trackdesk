import { notFound } from "next/navigation";
import { requests } from "@/lib/mock";
import { RequestTracking } from "./RequestTracking";

export function generateStaticParams() {
  return requests.map((r) => ({ id: r.id }));
}

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = requests.find((r) => r.id === id);
  if (!req) notFound();
  return <RequestTracking req={req} />;
}
