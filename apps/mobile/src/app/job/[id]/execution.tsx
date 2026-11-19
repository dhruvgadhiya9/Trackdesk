import { useState } from "react";
import { Camera, CheckCircle2, ClipboardList, Pause, Play, Save, ShieldCheck, Upload } from "lucide-react-native";
import { View } from "react-native";
import { router } from "expo-router";
import { Badge, Button, Card, Checkbox, Field, ListRow, Popup, RadioCard, Row, Screen, Text } from "@/components/ui";
import { WithJob } from "@/components/JobGuard";
import { pauseReasons } from "@/lib/mock";
import { completionGates, useStore } from "@/lib/store";
import { colors, space } from "@/theme";

export default function ExecutionScreen() {
  const { updateProgress, setStatus } = useStore();
  const [pauseOpen, setPauseOpen] = useState(false);
  const [reason, setReason] = useState<string>(pauseReasons[0]);
  const [details, setDetails] = useState("");
  const [gatesOpen, setGatesOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <WithJob>
      {(job, p) => {
        const doneActs = p.activities.filter(Boolean).length;
        const gates = completionGates(p);
        // Happy Code is the final gate: once checklist + proof are done the job moves to verification.
        const readyForCode = gates[0]!.done && gates[1]!.done;
        const go = (path: "checklist" | "proof" | "happy-code") => router.push({ pathname: `/job/[id]/${path}`, params: { id: job.id } });
        const paused = job.status === "Paused";
        return (
          <Screen
            title="Service Execution"
            back
            footer={
              <Button
                title="Submit Work"
                icon={CheckCircle2}
                block
                onPress={() => {
                  if (!readyForCode) return setGatesOpen(true);
                  setStatus(job.id, "Pending Verification");
                  go("happy-code");
                }}
              />
            }
          >
            <Card>
              <Row style={{ justifyContent: "space-between" }}>
                <Badge label={job.status} />
                <Text size="md" color={colors.muted}>{p.startedAt ? `Started ${p.startedAt}` : "Started earlier today"}</Text>
              </Row>
              {paused && p.pauseReason && <Text size="md" color={colors.warning700}>{`Paused: ${p.pauseReason}`}</Text>}
              <Row>
                {paused ? (
                  <Button title="Resume" icon={Play} variant="secondary" small block onPress={() => setStatus(job.id, "In Progress", { pauseReason: undefined })} />
                ) : (
                  <Button title="Pause Job" icon={Pause} variant="secondary" small block onPress={() => setPauseOpen(true)} />
                )}
                <Button title={saved ? "Saved" : "Save Progress"} icon={Save} variant="soft" small block onPress={() => setSaved(true)} />
              </Row>
            </Card>

            <Card title="Service Activities" right={<Badge label={`${doneActs} / ${job.activities.length}`} tone={doneActs === job.activities.length ? "success" : "warning"} />}>
              {job.activities.map((a, i) => (
                <Checkbox
                  key={a}
                  label={a}
                  checked={!!p.activities[i]}
                  disabled={paused}
                  onChange={(v) => {
                    setSaved(false);
                    updateProgress(job.id, { activities: p.activities.map((c, k) => (k === i ? v : c)) });
                  }}
                />
              ))}
              <Field label="Work Notes" multiline value={p.notes} onChangeText={(t) => { setSaved(false); updateProgress(job.id, { notes: t }); }} />
            </Card>

            <Card title="Before you can complete">
              <ListRow icon={ClipboardList} title="Checklist" sub={gates[0]!.done ? "Submitted" : "Not submitted"} right={<Badge label={gates[0]!.done ? "Done" : "To do"} tone={gates[0]!.done ? "success" : "warning"} />} onPress={() => go("checklist")} />
              <ListRow icon={Camera} title="Proof of work" sub={gates[1]!.done ? "Submitted for verification" : "Photos & documents"} right={<Badge label={gates[1]!.done ? "Done" : "To do"} tone={gates[1]!.done ? "success" : "warning"} />} onPress={() => go("proof")} />
              <ListRow icon={ShieldCheck} title="Happy Code" sub="Customer verification" right={<Badge label={gates[2]!.done ? "Done" : "Last step"} tone={gates[2]!.done ? "success" : "neutral"} />} last />
            </Card>

            <Popup
              visible={pauseOpen}
              onClose={() => setPauseOpen(false)}
              icon={Pause}
              tone="warning"
              title="Pause job"
              message="A reason is required. The manager will be notified."
              actions={
                <>
                  <Button title="Cancel" variant="secondary" block onPress={() => setPauseOpen(false)} />
                  <Button
                    title="Pause Job"
                    block
                    onPress={() => {
                      setStatus(job.id, "Paused", { pauseReason: details ? `${reason} — ${details}` : reason });
                      setPauseOpen(false);
                    }}
                  />
                </>
              }
            >
              <View style={{ gap: space.sm }}>
                {pauseReasons.map((r) => <RadioCard key={r} label={r} selected={reason === r} onPress={() => setReason(r)} />)}
                <Field label="Details" multiline value={details} onChangeText={setDetails} />
              </View>
            </Popup>

            <Popup
              visible={gatesOpen}
              onClose={() => setGatesOpen(false)}
              icon={Upload}
              tone="warning"
              title="Can’t complete yet"
              message="All three steps must be done before the job can be marked completed."
              actions={
                <Button
                  title={gates[0]!.done ? "Upload Proof" : "Open Checklist"}
                  block
                  onPress={() => {
                    setGatesOpen(false);
                    go(gates[0]!.done ? "proof" : "checklist");
                  }}
                />
              }
            >
              <View style={{ gap: space.sm }}>
                {gates.map((g) => (
                  <Row key={g.label} style={{ gap: 8 }}>
                    <CheckCircle2 size={18} color={g.done ? colors.success500 : colors.lineStrong} />
                    <Text weight="semibold" color={g.done ? colors.ink : colors.muted}>{g.label}</Text>
                  </Row>
                ))}
              </View>
            </Popup>
          </Screen>
        );
      }}
    </WithJob>
  );
}
