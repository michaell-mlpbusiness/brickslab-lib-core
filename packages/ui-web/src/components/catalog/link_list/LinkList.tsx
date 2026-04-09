import React from "react";
import { LinkListProps } from "./LinkList.type";

export function LinkList({ links, title }: LinkListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {title && (
        <div
          style={{
            fontWeight: 600,
            fontSize: "var(--fontsize-sm)",
            color: "var(--color-fg)",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {links.map((item, index) => (
          <div
            key={item.href}
            style={{
              borderBottom:
                index < links.length - 1 ? "1px solid var(--c-border)" : "none",
              padding: "8px 0",
            }}
          >
            <a
              href={item.href}
              style={{
                fontWeight: 500,
                color: "var(--color-brand)",
                fontSize: "var(--fontsize-sm)",
                textDecoration: "none",
                display: "block",
              }}
            >
              {item.label}
            </a>
            {item.description && (
              <div
                style={{
                  fontSize: "var(--fontsize-xs)",
                  color: "var(--color-muted)",
                  marginTop: 2,
                }}
              >
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
