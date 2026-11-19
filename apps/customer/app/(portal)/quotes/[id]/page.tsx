import { notFound } from "next/navigation";
import { quotes } from "@/lib/mock";
import { QuoteDetails } from "./QuoteDetails";

export function generateStaticParams() {
  return quotes.filter((q) => q.lines).map((q) => ({ id: q.id }));
}

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = quotes.find((q) => q.id === id);
  if (!quote?.lines) notFound();
  return <QuoteDetails quote={quote} />;
}
