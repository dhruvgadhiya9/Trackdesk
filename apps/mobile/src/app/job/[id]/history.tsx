import { useState } from "react";
import { Award, Wrench } from "lucide-react-native";
import { Badge, Card, ListRow, Screen, Segmented } from "@/components/ui";
import { WithJob } from "@/components/JobGuard";
import { previousServices } from "@/lib/mock";

const tabs = ["Previous Services", "Warranty History"] as const;

export default function HistoryScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Previous Services");
  return (
    <WithJob>
      {(job) => (
        <Screen title="Previous History" back>
          <Segmented label="History type" options={tabs} value={tab} onChange={setTab} />
          {tab === "Previous Services" ? (
            <Card title={job.property}>
              {previousServices.map((s, i) => (
                <ListRow key={s.service + s.meta} icon={Wrench} title={s.service} sub={s.meta} last={i === previousServices.length - 1} />
              ))}
            </Card>
          ) : (
            <Card title="Warranty History">
              <ListRow icon={Award} iconTone="success" title="WAR-0302 · AC Servicing" sub="Expires 01 Feb 2027" right={<Badge label="Active" />} last />
            </Card>
          )}
        </Screen>
      )}
    </WithJob>
  );
}
