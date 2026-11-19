// SECURITY-REVIEW-REQUIRED: "Start job" captures GPS location (consented, action-triggered only).
import { useState } from "react";
import { CheckCircle2, ClipboardList, History, MapPin, MessageSquare, Navigation, Phone, Play, ShieldCheck, Wrench } from "lucide-react-native";
import { Linking, View } from "react-native";
import { router } from "expo-router";
import { Avatar, Badge, Button, Card, InfoGrid, ListRow, Popup, Row, Screen, Text } from "@/components/ui";
import { WithJob } from "@/components/JobGuard";
import { useStore } from "@/lib/store";
import { colors, space } from "@/theme";

export default function JobDetailsScreen() {
  return <WithJob>{(job, p) => <JobDetails jobId={job.id} key={job.id} progress={p} />}</WithJob>;
}

function JobDetails({ jobId, progress: p }: { jobId: string; progress: import("@/lib/store").JobProgress }) {
  const { job, setStatus } = useStore();
  const j = job(jobId)!;
  const [accept, setAccept] = useState(false);
  const [start, setStart] = useState(false);
  const go = (path: "navigation" | "checklist" | "execution" | "proof" | "quotation" | "history" | "happy-code") =>
    router.push({ pathname: `/job/[id]/${path}`, params: { id: j.id } });
  const done = p.checklist.filter(Boolean).length;

  const footer = (() => {
    switch (j.status) {
      case "Scheduled":
      case "Assigned":
        return <Button title="Accept Job" icon={CheckCircle2} block onPress={() => setAccept(true)} />;
      case "Accepted":
        return (
          <>
            <Button title="Navigate" icon={Navigation} variant="secondary" block onPress={() => go("navigation")} />
            <Button title="Start Job" icon={Play} block onPress={() => setStart(true)} />
          </>
        );
      case "In Progress":
      case "Paused":
        return <Button title={j.status === "Paused" ? "Resume Work" : "Service Execution"} icon={Wrench} block onPress={() => go("execution")} />;
      case "Pending Verification":
        return <Button title="Enter Happy Code" icon={ShieldCheck} block onPress={() => go("happy-code")} />;
      default:
        return null;
    }
  })();

  return (
    <Screen title={j.id} back footer={footer}>
      <Card>
        <Row style={{ gap: 6 }}>
          <Badge label={j.priority} />
          <Badge label={j.status} />
        </Row>
        <Text size="display" weight="extrabold">{j.service}</Text>
        <InfoGrid items={[["Scheduled", j.window], ["Service Type", j.category]]} />
        <Row style={{ alignItems: "flex-start", gap: 8 }}>
          <MapPin size={16} color={colors.muted} />
          <Text size="md" color={colors.ink2} style={{ flex: 1 }}>{`${j.property} · ${j.address}`}</Text>
        </Row>
        <Button title="Start Navigation" icon={Navigation} variant="soft" small onPress={() => go("navigation")} />
      </Card>

      <Card title="Customer">
        <Row>
          <Avatar name={j.customer} />
          <View style={{ flex: 1 }}>
            <Text weight="bold">{j.customer}</Text>
            <Text size="md" color={colors.muted}>{j.customerPhone}</Text>
          </View>
        </Row>
        <Row>
          <Button title="Call" icon={Phone} variant="secondary" small block onPress={() => Linking.openURL(`tel:${j.customerPhone.replace(/[^\d+]/g, "")}`)} />
          <Button title="Chat" icon={MessageSquare} variant="secondary" small block onPress={() => router.push("/chat")} />
        </Row>
      </Card>

      <Card>
        <ListRow icon={ClipboardList} title="Checklist" sub={`${j.checklistName} · ${done} / ${j.checklist.length}`} onPress={() => go("checklist")} />
        <ListRow icon={History} title="Previous History" sub="3 services · 1 active warranty" onPress={() => go("history")} />
        <ListRow icon={Wrench} iconTone="violet" title="Quotation Assessment" sub="Parts, labour, site survey" onPress={() => go("quotation")} last />
      </Card>

      {j.notes && (
        <Card title="Problem notes">
          <Text color={colors.ink2}>{`“${j.notes}”`}</Text>
        </Card>
      )}

      <Popup
        visible={accept}
        onClose={() => setAccept(false)}
        icon={CheckCircle2}
        title="Accept this job?"
        message={`Are you sure you want to accept ${j.id} (${j.service}, ${j.priority})?`}
        actions={
          <>
            <Button title="Cancel" variant="secondary" block onPress={() => setAccept(false)} />
            <Button title="Accept" block onPress={() => { setStatus(j.id, "Accepted"); setAccept(false); }} />
          </>
        }
      />
      <Popup
        visible={start}
        onClose={() => setStart(false)}
        icon={Play}
        title="Start job?"
        message="GPS location will be captured. Continue?"
        actions={
          <>
            <Button title="Cancel" variant="secondary" block onPress={() => setStart(false)} />
            <Button
              title="Start Job"
              block
              onPress={() => {
                const t = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                setStatus(j.id, "In Progress", { startedAt: t });
                setStart(false);
                go("execution");
              }}
            />
          </>
        }
      />
      <View style={{ height: space.sm }} />
    </Screen>
  );
}
