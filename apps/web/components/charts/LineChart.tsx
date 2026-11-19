/** Two-series SVG line chart (current vs previous) drawn with token colour classes. */
export function LineChart({
  labels,
  current,
  previous,
  label,
  height = 220,
}: {
  labels: string[];
  current: number[];
  previous?: number[];
  label: string;
  height?: number;
}) {
  const w = 640;
  const h = height;
  const pad = 28;
  const max = Math.max(...current, ...(previous ?? [])) * 1.1 || 1;
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, labels.length - 1);
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const line = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const area = `${line(current)} L${x(current.length - 1)},${h - pad} L${x(0)},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} className="h-auto w-full">
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={y(max * t)} y2={y(max * t)} className="stroke-line-soft" strokeWidth={1} />
      ))}
      <path d={area} className="fill-primary-50" />
      {previous && <path d={line(previous)} fill="none" className="stroke-line-strong" strokeWidth={2} strokeDasharray="5 5" />}
      <path d={line(current)} fill="none" className="stroke-primary-600" strokeWidth={3} strokeLinecap="round" />
      {labels.map((l, i) => (
        <text key={`${l}-${i}`} x={x(i)} y={h - 6} textAnchor="middle" className="fill-muted text-xs">
          {l}
        </text>
      ))}
    </svg>
  );
}
