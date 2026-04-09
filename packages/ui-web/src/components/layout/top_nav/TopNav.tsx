import React from "react";
import { TopNavProps } from "./TopNav.type";

export function TopNav({ items, activePath }: TopNavProps) {
  return (
    <nav>
      <ul
        style={{
          display: "flex",
          gap: "var(--space-6, 24px)",
          listStyle: "none",
          padding: 0,
          margin: 0,
          fontSize: "var(--fontsize-sm, 14px)",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {items.map((item) => {
          const isActive = item.href === activePath;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                style={{
                  color: isActive ? "var(--color-brand)" : "var(--color-muted)",
                  fontWeight: isActive ? "var(--fontweight-semibold, 600)" : "var(--fontweight-normal, 400)",
                  borderBottom: isActive ? "2px solid var(--color-brand)" : "2px solid transparent",
                  textDecoration: "none",
                  paddingBottom: "var(--space-1, 2px)",
                  transition: "color 0.15s",
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
