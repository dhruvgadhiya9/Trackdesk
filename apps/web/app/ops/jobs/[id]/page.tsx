import { notFound } from "next/navigation";
import { opsJobs } from "@/lib/ops-mock";
import { OpsJobDetails } from "./OpsJobDetails";

export function generateStaticParams() {
  return opsJobs.map((j) => ({ id: j.id }));
}

export default async function OpsJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = opsJobs.find((j) => j.id === id);
  if (!job) notFound();
  return <OpsJobDetails job={job} />;
}
