import { Avatar } from "@trackdesk/ui";

export function PersonCell({ name, sub }: { name: string | null; sub?: string }) {
  if (!name) return <span className="text-subtle">—</span>;
  return (
    <span className="flex items-center gap-2.5">
      <Avatar name={name} size="sm" />
      <span className="flex flex-col">
        <span className="font-semibold text-ink">{name}</span>
        {sub && <span className="text-xs text-muted">{sub}</span>}
      </span>
    </span>
  );
}
