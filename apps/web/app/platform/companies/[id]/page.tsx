import { notFound } from "next/navigation";
import { companies } from "@/lib/platform-mock";
import { CompanyDetails } from "./CompanyDetails";

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }));
}

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = companies.find((c) => c.id === id);
  if (!company) notFound();
  return <CompanyDetails company={company} />;
}
