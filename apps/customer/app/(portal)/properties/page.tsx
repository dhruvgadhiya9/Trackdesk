"use client";

import Link from "next/link";
import { Building, Home, MapPin, Plus } from "lucide-react";
import { Badge, buttonClass, EmptyState, ErrorState, PageHeader, Skeleton, useQuery } from "@trackdesk/ui";
import { api } from "@/lib/api";

export default function PropertiesPage() {
  const { state, retry } = useQuery(api.properties);
  return (
    <>
      <PageHeader
        crumbs={["Home", "Properties"]}
        title="My Properties"
        subtitle="Raise service requests against any of your properties."
        actions={<Link href="/properties/new" className={buttonClass("primary")}><Plus aria-hidden="true" className="size-4" />Add Property</Link>}
      />
      {state.status === "loading" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div>
      )}
      {state.status === "error" && <ErrorState message={state.error} onRetry={retry} />}
      {state.status === "success" && state.data.length === 0 && (
        <EmptyState title="No properties yet" message="Add your home or business to request a service." action={<Link href="/properties/new" className={buttonClass("primary")}>Add Property</Link>} />
      )}
      {state.status === "success" && state.data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.data.map((p) => {
            const Icon = p.type === "Home" ? Home : Building;
            return (
              <section key={p.id} className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 shadow-card">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Icon aria-hidden="true" className="size-5" /></span>
                  <div className="flex flex-1 flex-col gap-1">
                    <h2 className="m-0 text-base font-bold text-ink">{p.name}</h2>
                    <span className="flex gap-1.5"><Badge tone="primary">{p.type}</Badge><Badge>{p.category}</Badge></span>
                  </div>
                </div>
                <p className="m-0 flex items-start gap-2 text-sm text-ink-3"><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" />{p.address}, {p.city}</p>
                <div className="mt-auto flex gap-2">
                  <Link href={`/properties/${p.id}`} className={buttonClass("secondary", "sm")}>View</Link>
                  <Link href="/properties/new" className={buttonClass("ghost", "sm")}>Edit</Link>
                </div>
              </section>
            );
          })}
          <Link href="/properties/new" className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong text-sm font-semibold text-primary-700 no-underline hover:border-primary-300 hover:bg-primary-50">
            <Plus aria-hidden="true" className="size-6" />Add another property
          </Link>
        </div>
      )}
    </>
  );
}
