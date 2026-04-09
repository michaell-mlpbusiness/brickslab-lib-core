import React from "react";
import type { CohortTrendsProps } from "./CohortTrends.type";

const styles = `
[data-bl-cohort-trends] {
  display: flex;
  flex-direction: column;
  gap: 12px;
  will-change: transform;
}
[data-bl-ct-header] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
[data-bl-ct-metric] {
  font-size: var(--fontsize-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted);
  opacity: 0.75;
}
[data-bl-ct-svg] {
  width: 100%;
  overflow: visible;
  will-change: transform;
}
[data-bl-ct-legend] {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
[data-bl-ct-legend-item] {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fontsize-xs);
  color: var(--color-muted);
}
[data-bl-ct-legend-line] {
  width: 20px;
  height: 2px;
  border-radius: 1px;
  flex-shrink: 0;
}
[data-bl-ct-axis-label] {
  font-size: 9px;
  fill: var(--color-muted);
  font-family: inherit;
}
[data-bl-ct-polyline] {
  will-change: transform;
}
[data-bl-ct-point] {
  will-change: transform;
}
`;

const LINE_PALETTE = [
  "#CC4A48",
  "#4ADE80",
  "#F59E0B",
  "var(--c-cohort-4)",
  "var(--c-cohort-5)",
  "var(--c-cohort-6)",
];

const W = 400;
const H = 160;
const PAD = { top: 10, right: 10, bottom: 30, left: 36 };

export function CohortTrends({ series, metric, granularity = "day" }: CohortTrendsProps) {
  if (!series?.length) return null;

  // Collect all x labels across series
  const allX = Array.from(
    new Set(series?.flatMap((s) => s?.points?.map((p) => String(p.x)) ?? []) ?? [])
  );
  const allY = series?.flatMap((s) => s?.points?.map((p) => p.y) ?? []) ?? [];
  const minY = allY.length ? Math.min(...allY, 0) : 0;
  const maxY = allY.length ? Math.max(...allY, 1) : 1;

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xScale = (xi: number) => PAD.left + (xi / Math.max(allX.length - 1, 1)) * chartW;
  const yScale = (y: number) => PAD.top + chartH - ((y - minY) / (maxY - minY || 1)) * chartH;

  // Y axis ticks
  const yTicks = [minY, Math.round((minY + maxY) / 2), maxY];

  // X axis: show first, middle, last
  const xTickIdxs = allX.length <= 1 ? [0] : [0, Math.floor((allX.length - 1) / 2), allX.length - 1];

  return (
    <>
      <style>{styles}</style>
      <div data-bl-cohort-trends>
        <div data-bl-ct-header>
          <span data-bl-ct-metric>{metric}</span>
          <span style={{ fontSize: "var(--fontsize-xs)", color: "var(--color-muted)", opacity: 0.6 }}>{granularity}</span>
        </div>

        <svg
          data-bl-ct-svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ height: H }}
          role="img"
          aria-label={`${metric} cohort trends`}
        >
          {/* Y grid lines */}
          {yTicks?.map((tick, i) => (
            <g key={i}>
              <line
                x1={PAD.left} y1={yScale(tick)}
                x2={W - PAD.right} y2={yScale(tick)}
                stroke="var(--c-border)"
                strokeWidth="1"
                strokeDasharray={i === 0 ? "none" : "3 3"}
              />
              <text
                data-bl-ct-axis-label
                x={PAD.left - 4}
                y={yScale(tick) + 4}
                textAnchor="end"
              >
                {tick.toLocaleString()}
              </text>
            </g>
          ))}

          {/* X labels */}
          {xTickIdxs?.map((xi) => (
            <text
              key={xi}
              data-bl-ct-axis-label
              x={xScale(xi)}
              y={H - 6}
              textAnchor={xi === 0 ? "start" : xi === allX.length - 1 ? "end" : "middle"}
            >
              {allX[xi]}
            </text>
          ))}

          {/* Lines */}
          {series?.map((s, si) => {
            const color = LINE_PALETTE[si % LINE_PALETTE.length];
            const pts = s?.points?.map((p) => {
              const xi = allX.indexOf(String(p.x));
              return `${xScale(xi)},${yScale(p.y)}`;
            }) ?? [];
            return (
              <g key={s?.name}>
                <polyline
                  points={pts.join(" ")}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  data-bl-ct-polyline
                />
                {s?.points?.map((p, pi) => {
                  const xi = allX.indexOf(String(p.x));
                  return (
                    <circle
                      key={pi}
                      cx={xScale(xi)}
                      cy={yScale(p.y)}
                      r="3"
                      fill={color}
                      stroke="var(--c-surface)"
                      strokeWidth="1.5"
                      data-bl-ct-point
                    >
                      <title>{`${s?.name}: ${p.y} (${p.x})`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {series.length > 1 && (
          <div data-bl-ct-legend style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {series?.map((s, si) => (
              <div key={s?.name} data-bl-ct-legend-item>
                <div data-bl-ct-legend-line style={{ background: LINE_PALETTE[si % LINE_PALETTE.length] }} />
                {s?.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
