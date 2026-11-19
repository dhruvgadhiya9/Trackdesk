"use client";

import { useState } from "react";
import { Clock, Headset, Smile, Wifi } from "lucide-react";
import { Button, Modal, TextField } from "@trackdesk/ui";
import { ListScreen } from "@/components/ListScreen";
import { PersonCell } from "@/components/PersonCell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Agent } from "@/lib/platform-mock";

export default function AgentsPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListScreen<Agent>
        crumbs={["Home", "Support", "Agents"]}
        title="Support Agents"
        subtitle="Create support agents, assign tickets and manage escalation."
        entity="Agent"
        headerActions={<Button onClick={() => setOpen(true)}>Add Agent</Button>}
        kpis={[
          { label: "Total Agents", value: "12", icon: <Headset className="size-5" /> },
          { label: "Online Now", value: "8", icon: <Wifi className="size-5" />, tone: "success" },
          { label: "Avg. Resolution", value: "5h 12m", delta: "-18m", icon: <Clock className="size-5" />, tone: "info" },
          { label: "CSAT", value: "4.8 / 5", delta: "+0.1", icon: <Smile className="size-5" />, tone: "violet" },
        ]}
        load={api.agents}
        search={{ placeholder: "Search agents…", text: (a) => `${a.name} ${a.email}` }}
        filters={[{ label: "Status", get: (a) => a.status }]}
        columns={[
          { key: "n", header: "Agent Name", render: (a) => <PersonCell name={a.name} /> },
          { key: "e", header: "Email", render: (a) => a.email },
          { key: "o", header: "Open Tickets", align: "right", render: (a) => a.open },
          { key: "r", header: "Resolved Tickets", align: "right", render: (a) => a.resolved },
          { key: "s", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
        ]}
      />
      <Modal
        open={open}
        title="Add support agent"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Send Invite</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <TextField label="Full Name" required />
          <TextField label="Work Email" type="email" required hint="The agent receives an invite link to set their own password." />
        </div>
      </Modal>
    </>
  );
}
