import React from "react";
import { UserTableProps } from "./UserTable.type";
import { Button } from "../ui/button/Button";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const userTableStyles = `
  .bl-user-table-row { will-change: background-color; }
  .bl-user-table-btn { will-change: transform; }
`;

export function UserTable({ users, onEdit, onDelete, title = "Utilisateurs" }: UserTableProps) {
  return (
    <>
      <style>{userTableStyles}</style>
      <div
        style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          boxShadow: "var(--shadow-2)",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "var(--space-4)" }}>
          <p style={{ margin: 0, fontSize: "var(--fontsize-lg)", fontWeight: "var(--fontweight-semibold)", color: "var(--color-fg)" }}>
            {title}
          </p>
        </div>

        {/* Table wrapper with overflow handling */}
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            contain: "layout",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "var(--fontsize-sm)",
              boxSizing: "border-box",
              minWidth: "600px",
            }}
            role="table"
            aria-label={title}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid var(--c-border)",
                }}
              >
                <th
                  scope="col"
                  style={{
                    textAlign: "left",
                    padding: "var(--space-3)",
                    fontWeight: "var(--fontweight-semibold)",
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                    fontSize: "var(--fontsize-xs)",
                    letterSpacing: "0.06em",
                  }}
                >
                  ID
                </th>
                <th
                  scope="col"
                  style={{
                    textAlign: "left",
                    padding: "var(--space-3)",
                    fontWeight: "var(--fontweight-semibold)",
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                    fontSize: "var(--fontsize-xs)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Username
                </th>
                <th
                  scope="col"
                  style={{
                    textAlign: "left",
                    padding: "var(--space-3)",
                    fontWeight: "var(--fontweight-semibold)",
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                    fontSize: "var(--fontsize-xs)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Email
                </th>
                <th
                  scope="col"
                  style={{
                    textAlign: "left",
                    padding: "var(--space-3)",
                    fontWeight: "var(--fontweight-semibold)",
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                    fontSize: "var(--fontsize-xs)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Password
                </th>
                <th
                  scope="col"
                  style={{
                    textAlign: "center",
                    padding: "var(--space-3)",
                    fontWeight: "var(--fontweight-semibold)",
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                    fontSize: "var(--fontsize-xs)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "var(--space-6)",
                      textAlign: "center",
                      color: "var(--color-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="bl-user-table-row"
                    style={{
                      borderBottom: index < users.length - 1 ? "1px solid var(--c-border)" : undefined,
                      transition: "background-color 0.2s ease",
                      willChange: "background-color",
                    }}
                  >
                    <td
                      scope="row"
                      style={{
                        padding: "var(--space-3)",
                        color: "var(--color-fg)",
                        fontFamily: "monospace",
                        fontSize: "var(--fontsize-xs)",
                      }}
                      aria-label={`ID: ${user.id}`}
                    >
                      {user.id}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3)",
                        color: "var(--color-fg)",
                        fontWeight: "var(--fontweight-medium)",
                      }}
                      aria-label={`Username: ${user.username}`}
                    >
                      {user.username}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3)",
                        color: "var(--color-fg)",
                      }}
                      aria-label={`Email: ${user.email}`}
                    >
                      {user.email}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3)",
                        color: "var(--color-muted)",
                        fontFamily: "monospace",
                        fontSize: "var(--fontsize-xs)",
                      }}
                      aria-label={`Mot de passe de: ${user.username}`}
                    >
                      {user.password}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "var(--space-2)",
                          flexWrap: "wrap" as React.CSSProperties["flexWrap"],
                        }}
                      >
                        {onEdit && (
                          <span className="bl-user-table-btn">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(user)}
                              leftIcon={<FiEdit2 size={14} aria-hidden="true" />}
                              style={{ padding: "var(--space-2)", willChange: "transform" }}
                              aria-label={`Modifier l'utilisateur ${user.username}`}
                            >
                              Edit
                            </Button>
                          </span>
                        )}
                        {onDelete && (
                          <span className="bl-user-table-btn">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => onDelete(user)}
                              leftIcon={<FiTrash2 size={14} aria-hidden="true" />}
                              style={{ padding: "var(--space-2)", willChange: "transform" }}
                              aria-label={`Supprimer l'utilisateur ${user.username}`}
                            >
                              Delete
                            </Button>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
