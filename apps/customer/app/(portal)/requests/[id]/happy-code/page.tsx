import { notFound } from "next/navigation";
import { requests } from "@/lib/mock";
import { HappyCode } from "./HappyCode";

export function generateStaticParams() {
  return requests.filter((r) => r.happyCode).map((r) => ({ id: r.id }));
}

export default async function HappyCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = requests.find((r) => r.id === id);
  if (!req?.happyCode) notFound();
  return <HappyCode req={req} />;
}
