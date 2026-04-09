import React from "react";
import type { BurgerMenuProps, BurgerMenuSection } from "./BurgerMenu.type";

export function BurgerMenu({
  isOpen,
  onClose,
  onOpen,
  sections,
  activePath,
  width = 280,
}: BurgerMenuProps) {
  return (
    <>
      {/* Burger Menu Button - Always visible */}
      <button
        onClick={() => (isOpen ? onClose() : onOpen?.())}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: "var(--z-modal, 1002)",
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--radius-md)",
          padding: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          willChange: "transform",
          transition: "background-color 0.2s",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {isOpen ? (
            // X icon when menu is open
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            // Burger icon when menu is closed
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Menu - Only visible when isOpen */}
      {!isOpen ? null : (
        <>
          {/* Overlay */}
          <div
            role="button"
            tabIndex={0}
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClose();
              }
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: "var(--z-modal, 1000)",
              cursor: "pointer",
            }}
            aria-label="Close menu"
          />

          {/* Menu */}
          <nav
            style={{
              position: "fixed",
              top: 60,
              left: 0,
              bottom: 0,
              width,
              backgroundColor: "var(--c-surface)",
              borderRight: "1px solid var(--c-border)",
              overflowY: "auto",
              padding: "28px 0",
              boxSizing: "border-box",
              zIndex: "var(--z-modal, 1001)",
              display: "flex",
              flexDirection: "column",
              willChange: "transform",
            }}
          >
        {sections.map(({ title, items }) => (
          <div key={title} style={{ marginBottom: 28, display: "flex", flexDirection: "column" }}>
            <p
              style={{
                padding: "0 20px",
                marginBottom: 6,
                marginTop: 0,
                fontSize: "var(--fontsize-xs, 0.75rem)",
                fontWeight: 600,
                color: "var(--color-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {title}
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map(({ label, href, onClick }) => {
                const isActive = activePath === href;
                return (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        onClick?.();
                        onClose();
                        window.location.href = href;
                      }}
                      style={{
                        display: "block",
                        padding: "10px 20px",
                        fontSize: "var(--fontsize-sm, 0.875rem)",
                        color: isActive ? "var(--color-brand)" : "var(--color-fg)",
                        textDecoration: "none",
                        transition: "background-color 0.2s, color 0.2s",
                        backgroundColor: isActive ? "var(--c-brand-subtle)" : "transparent",
                        borderLeft: `3px solid ${isActive ? "var(--color-brand)" : "transparent"}`,
                        fontWeight: isActive ? 600 : 500,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "var(--c-surface-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = isActive
                          ? "var(--c-brand-subtle)"
                          : "transparent";
                      }}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
        </>
      )}
    </>
  );
}
