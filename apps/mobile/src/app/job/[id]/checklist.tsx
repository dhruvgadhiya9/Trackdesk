import { useState } from "react";
import { Check, Paperclip } from "lucide-react-native";
import { router } from "expo-router";
import { Badge, Button, Card, Checkbox, Field, Notice, Screen, Segmented } from "@/components/ui";
import { WithJob } from "@/components/JobGuard";
import { useStore } from "@/lib/store";

const kinds = ["Service", "Inspection", "Quotation"] as const;

export default function ChecklistScreen() {
  const { updateProgress } = useStore();
  const [kind, setKind] = useState<(typeof kinds)[number]>("Service");
  const [error, setError] = useState<string>();
  return (
    <WithJob>
      {(job, p) => {
        const done = p.checklist.filter(Boolean).length;
        const all = done === job.checklist.length;
        return (
          <Screen
            title="Checklist"
            back
            footer={
              <Button
                title={p.checklistSubmitted ? "Checklist Submitted" : "Submit Checklist"}
                icon={Check}
                block
                disabled={p.checklistSubmitted}
                onPress={() => {
                  if (!all) return setError("Tick every item before submitting.");
                  updateProgress(job.id, { checklistSubmitted: true });
                  router.back();
                }}
              />
            }
          >
            <Segmented label="Checklist type" options={kinds} value={kind} onChange={setKind} />
            {kind === "Service" ? (
              <Card title={job.checklistName} right={<Badge label={`${done} / ${job.checklist.length}`} tone={all ? "success" : "warning"} />}>
                {job.checklist.map((item, i) => (
                  <Checkbox
                    key={item}
                    label={item}
                    checked={!!p.checklist[i]}
                    disabled={p.checklistSubmitted}
                    onChange={(v) => {
                      setError(undefined);
                      updateProgress(job.id, { checklist: p.checklist.map((c, k) => (k === i ? v : c)) });
                    }}
                  />
                ))}
              </Card>
            ) : (
              <Notice tone="neutral">{`No ${kind.toLowerCase()} checklist is assigned to this job.`}</Notice>
            )}
            {error && <Notice tone="danger">{error}</Notice>}
            <Card>
              <Field label="Work Notes" multiline value={p.notes} onChangeText={(t) => updateProgress(job.id, { notes: t })} editable={!p.checklistSubmitted} />
              <Button title="Add attachment" icon={Paperclip} variant="secondary" small onPress={() => router.push({ pathname: "/job/[id]/proof", params: { id: job.id } })} />
            </Card>
          </Screen>
        );
      }}
    </WithJob>
  );
}
