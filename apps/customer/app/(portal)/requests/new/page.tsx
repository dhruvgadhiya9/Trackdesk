import { NewRequestWizard } from "./NewRequestWizard";

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ property?: string }> }) {
  const { property } = await searchParams;
  return <NewRequestWizard initialProperty={property} />;
}
