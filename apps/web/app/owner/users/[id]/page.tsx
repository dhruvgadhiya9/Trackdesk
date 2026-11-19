import { notFound } from "next/navigation";
import { users } from "@/lib/mock";
import { UserForm } from "../UserForm";

export function generateStaticParams() {
  return users.map((u) => ({ id: u.id }));
}

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = users.find((u) => u.id === id);
  if (!user) notFound();
  return <UserForm user={user} />;
}
