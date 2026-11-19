import { notFound } from "next/navigation";
import { opsRequests } from "@/lib/ops-mock";
import { RequestDetails } from "./RequestDetails";

export function generateStaticParams() {
  return opsRequests.map((r) => ({ id: r.id }));
}

export default async function OpsRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = opsRequests.find((r) => r.id === id);
  if (!req) notFound();
  return <RequestDetails req={req} />;
}
