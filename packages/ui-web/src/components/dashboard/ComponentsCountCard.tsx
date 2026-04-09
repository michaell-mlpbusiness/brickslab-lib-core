import React from "react";
import { FiArrowRight } from "react-icons/fi";
import type { ComponentsCountCardProps } from "./ComponentsCountCard.type";
import { NumberTicker } from "../animated_text/number_ticker/NumberTicker";

export function ComponentsCountCard({
  count,
  subtitle = "Composants publiés",
  variant = "default",
  animate = false,
  sections,
  cta,
}: ComponentsCountCardProps) {
  if (variant === "dark") {
    const maxCount = sections && sections.length > 0 ? Math.max(...sections.map(s => s.count)) : 1;
    return (
      <div
        style={{
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(145deg, var(--color-dark-1) 0%, var(--color-dark-2) 55%, var(--color-dark-3) 100%)",
          padding: "clamp(24px, 4vw, 40px)",
          height: "100%",
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, var(--c-grid-dot) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", top: -60, left: -60, width: 340, height: 340, background: "radial-gradient(circle, var(--c-glow-brand) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -80, right: -60, width: 280, height: 280, background: "radial-gradient(circle, var(--c-glow-warning) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
          <span style={{ fontSize: "var(--fontsize-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--color-brand)", display: "block", marginBottom: "var(--space-5)" }}>
            ◈ Inventaire UI
          </span>

          <div style={{ marginBottom: "var(--space-1)" }}>
            <span style={{ fontSize: "clamp(72px, 10vw, 108px)", fontWeight: 900, letterSpacing: "-0.05em", color: "var(--color-bg-inverse)", lineHeight: 0.9, display: "block" }}>
              {animate ? <NumberTicker value={count} duration={1.5} startOnView /> : count}
            </span>
          </div>
          <span style={{ fontSize: "var(--fontsize-sm)", fontWeight: 400, color: "var(--color-text-muted)", letterSpacing: "0.01em", display: "block", marginBottom: "var(--space-7)" }}>
            {subtitle}
          </span>

          {sections && sections.length > 0 && (
            <>
              <div style={{ height: 1, background: "linear-gradient(90deg, var(--c-brand-divider), var(--c-divider-fade) 60%, transparent)", marginBottom: "var(--space-5)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-7)", flex: 1 }}>
                {sections.map(({ label, count: cnt }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <span style={{ fontSize: "var(--fontsize-xs)", color: "var(--color-text-muted-inverse)", flex: "0 0 110px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {label}
                    </span>
                    <div style={{ flex: 1, height: 3, background: "var(--c-bar-track)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(cnt / maxCount) * 100}%`, background: "linear-gradient(90deg, var(--color-brand), var(--color-warning))", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <span style={{ fontSize: "var(--fontsize-xs)", fontWeight: 700, color: "var(--color-text-faded)", minWidth: 22, textAlign: "right" }}>
                      {cnt}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {cta && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--fontsize-sm)", fontWeight: 600, color: "var(--color-bg-inverse)", padding: "var(--space-2) var(--space-4)", background: "var(--c-cta-bg)", border: "1px solid var(--c-cta-border)", borderRadius: "var(--radius-md)", width: "fit-content" }}>
              {cta} <FiArrowRight size={14} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--c-surface)",
        border: "1px solid var(--c-border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-5)",
        minWidth: 220,
        boxShadow: "var(--shadow-2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-md)",
            background: "var(--c-brand-subtle)",
            display: "grid",
            placeItems: "center",
            color: "var(--color-brand)",
            fontWeight: "var(--fontweight-bold)",
          }}
        >
          UI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          <span style={{ fontSize: "var(--fontsize-xs)", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Inventaire
          </span>
          <span style={{ fontSize: "var(--fontsize-sm)", color: "var(--color-fg)", opacity: 0.8 }}>{subtitle}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
        <span style={{ fontSize: "var(--fontsize-5xl, 42px)", fontWeight: "var(--fontweight-black)", letterSpacing: "-0.04em", color: "var(--color-fg)" }}>
          {animate ? <NumberTicker value={count} duration={1.2} startOnView /> : count}
        </span>
        <span style={{ fontSize: "var(--fontsize-xs)", color: "var(--color-muted)" }}>composants</span>
      </div>
    </div>
  );
}
