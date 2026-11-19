"use client";

import { BadgePercent, CircleDollarSign, Repeat, Ticket } from "lucide-react";
import { ListScreen } from "@/components/ListScreen";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Offer } from "@/lib/mock";

export default function OffersPage() {
  return (
    <ListScreen<Offer>
      crumbs={["Home", "Services", "Offers"]}
      title="Offer Management"
      subtitle="Create offers and coupons for services and branches."
      entity="Offer"
      createHref="/owner/offers/new"
      createLabel="Create Offer"
      editHref={() => "/owner/offers/new"}
      kpis={[
        { label: "Active Offers", value: "8", delta: "+2", icon: <BadgePercent className="size-5" /> },
        { label: "Redemptions (30d)", value: "312", delta: "+18%", icon: <Repeat className="size-5" />, tone: "violet" },
        { label: "Discount Given", value: "$9,840", icon: <CircleDollarSign className="size-5" />, tone: "warning" },
        { label: "Coupon Usage", value: "146", delta: "+9", icon: <Ticket className="size-5" />, tone: "success" },
      ]}
      load={api.offers}
      search={{ placeholder: "Search offers or codes…", text: (o) => `${o.name} ${o.code}` }}
      filters={[{ label: "Status", get: (o) => o.status }]}
      columns={[
        { key: "name", header: "Offer Name", render: (o) => <span className="font-semibold text-ink">{o.name}</span> },
        { key: "code", header: "Code", render: (o) => <code className="font-semibold text-primary-700">{o.code}</code> },
        { key: "type", header: "Offer Type", render: (o) => o.type },
        { key: "validity", header: "Validity", render: (o) => o.validity },
        { key: "branches", header: "Branches", render: (o) => o.branches },
        { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
      ]}
    />
  );
}
