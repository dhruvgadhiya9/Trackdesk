import Link from "next/link";
import { buttonClass } from "@trackdesk/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="m-0 text-title font-extrabold text-ink">Page not found</h1>
      <p className="m-0 text-base text-muted">The page you are looking for does not exist or was moved.</p>
      <Link href="/" className={buttonClass("primary")}>Back to dashboard</Link>
    </main>
  );
}
