import { notFound } from "next/navigation";
import { jobs } from "@/lib/mock";
import { JobDetails } from "./JobDetails";

export function generateStaticParams() {
  return jobs.map((j) => ({ id: j.id }));
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);
  if (!job) notFound();
  return <JobDetails job={job} />;
}
