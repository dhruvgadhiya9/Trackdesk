import { notFound } from "next/navigation";
import { platformTickets } from "@/lib/platform-mock";
import { TicketDetails } from "./TicketDetails";

export function generateStaticParams() {
  return platformTickets.map((t) => ({ id: t.id }));
}

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = platformTickets.find((t) => t.id === id);
  if (!ticket) notFound();
  return <TicketDetails ticket={ticket} />;
}
