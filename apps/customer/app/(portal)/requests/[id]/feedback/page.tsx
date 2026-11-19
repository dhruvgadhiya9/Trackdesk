import { notFound } from "next/navigation";
import { requests } from "@/lib/mock";
import { Feedback } from "./Feedback";

export function generateStaticParams() {
  return requests.filter((r) => r.stage === "Completed").map((r) => ({ id: r.id }));
}

export default async function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = requests.find((r) => r.id === id);
  if (!req || req.stage !== "Completed") notFound();
  return <Feedback req={req} />;
}
