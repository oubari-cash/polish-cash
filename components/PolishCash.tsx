"use client";

import { useState } from "react";
import Image from "next/image";
import { FixCard } from "./FixCard";
import { TEAMS, FIXES, PROCESS_STEPS, SETUP_STEPS } from "@/data/fixes";
import type { Fix } from "@/types";

const GREEN = "#00E013";

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */
export function PolishCash() {
  const [filter, setFilter]                 = useState("All");
  const [processOpen, setProcessOpen]       = useState(false);
  const [setupOpen, setSetupOpen]           = useState(false);
  const [selectedFix, setSelectedFix]       = useState<Fix | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const filtered = filter === "All" ? FIXES : FIXES.filter(f => f.team === filter);

  const toggleStep = (id: number) =>
    setCompletedSteps(p => ({ ...p, [id]: !p[id] }));
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div style={{ background: "#fff", color: "#000", minHeight: "100vh" }}>

      {/* ─── NAV ───────────────────────────────────────────── */}
      <header style={{
        padding: "0 32px",
        height: 64,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            color: "#000",
          }}>
            ✦
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.03em" }}>
            Polish Cash
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <NavBtn onClick={() => setProcessOpen(true)} bg="#000" color="#fff">
            How it works
          </NavBtn>
          <NavBtn onClick={() => setSetupOpen(true)} bg={GREEN} color="#000">
            Get started →
          </NavBtn>
        </div>
      </header>


      {/* ─── HERO ──────────────────────────────────────────── */}
      <section style={{
        textAlign: "center",
        padding: "100px 32px 80px",
        maxWidth: 800,
        margin: "0 auto",
      }}>
        <div style={{
          fontSize: "clamp(80px, 18vw, 160px)",
          fontWeight: 600,
          letterSpacing: "-0.05em",
          lineHeight: 0.9,
          color: "#000",
          marginBottom: 24,
        }}>
          {FIXES.length}
        </div>
        <div style={{
          fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 600,
          letterSpacing: "-0.035em",
          color: "#000",
          lineHeight: 1.1,
          maxWidth: 520,
          margin: "0 auto",
        }}>
          visual bugs found and&nbsp;fixed
        </div>
      </section>


      {/* ─── FILTER ────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        padding: "0 32px 48px",
        flexWrap: "wrap",
      }}>
        {TEAMS.map(t => {
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: "9px 22px",
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                background: active ? "#000" : "#f2f2f2",
                color: active ? "#fff" : "rgba(0,0,0,0.4)",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>


      {/* ─── FIX FEED ──────────────────────────────────────── */}
      <div style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}>
        {filtered.map(fix => (
          <FixCard key={fix.id} fix={fix} onClick={() => setSelectedFix(fix)} />
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: "rgba(0,0,0,0.15)",
              marginBottom: 16,
            }}>
              Nothing here yet
            </div>
            <button
              onClick={() => setSetupOpen(true)}
              style={{
                padding: "12px 28px",
                borderRadius: 100,
                background: GREEN,
                color: "#000",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Set up this team →
            </button>
          </div>
        )}
      </div>

      <div style={{ height: 120 }} />


      {/* ─── HOW IT WORKS — CENTER MODAL ────────────────────── */}
      <Modal isOpen={processOpen} onClose={() => setProcessOpen(false)}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 40px 56px" }}>
          <h2 style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            marginBottom: 12,
            lineHeight: 1.1,
          }}>
            How it works
          </h2>
          <p style={{
            fontSize: 16,
            fontWeight: 500,
            color: "rgba(0,0,0,0.4)",
            lineHeight: 1.6,
            letterSpacing: "-0.02em",
            marginBottom: 48,
          }}>
            Spot a bug → post it in Slack → it gets fixed automatically. Five steps, mostly on autopilot.
          </p>

          {PROCESS_STEPS.map((step, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 20,
              paddingBottom: 32,
              marginBottom: 32,
              borderBottom: i < PROCESS_STEPS.length - 1
                ? "1px solid rgba(0,0,0,0.06)" : "none",
            }}>
              <div style={{
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                color: GREEN,
                lineHeight: 1,
                flexShrink: 0,
                width: 52,
              }}>
                {step.num}
              </div>
              <div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  marginBottom: 6,
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.4)",
                  lineHeight: 1.6,
                  letterSpacing: "-0.01em",
                }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>


      {/* ─── GET STARTED — CENTER MODAL ─────────────────────── */}
      <Modal isOpen={setupOpen} onClose={() => setSetupOpen(false)}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 40px 56px" }}>
          <h2 style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            marginBottom: 12,
            lineHeight: 1.1,
          }}>
            Get started
          </h2>
          <p style={{
            fontSize: 16,
            fontWeight: 500,
            color: "rgba(0,0,0,0.4)",
            lineHeight: 1.6,
            letterSpacing: "-0.02em",
            marginBottom: 40,
          }}>
            Five steps to set up the pipeline for your team. Each one opens exactly where you need to go.
          </p>

          {/* Progress */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.3)" }}>
              Progress
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>
              {completedCount} of {SETUP_STEPS.length}
            </span>
          </div>
          <div style={{ height: 4, background: "#f0f0f0", borderRadius: 4, marginBottom: 36 }}>
            <div style={{
              height: "100%",
              width: `${(completedCount / SETUP_STEPS.length) * 100}%`,
              background: GREEN,
              borderRadius: 4,
              transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
            }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SETUP_STEPS.map(step => {
              const done = completedSteps[step.id];
              return (
                <div key={step.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 18,
                  background: done ? "#f0fbf0" : "#f7f7f7",
                  transition: "background 0.2s",
                }}>
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleStep(step.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: done ? GREEN : "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: done ? "#000" : "transparent",
                      fontSize: 13,
                      fontWeight: 800,
                      flexShrink: 0,
                      transition: "background 0.18s",
                    }}
                  >
                    ✓
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: done ? "#16a34a" : "#000",
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.35)",
                      marginTop: 2,
                    }}>
                      {step.desc}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStep(step.id)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 100,
                      fontSize: 13,
                      fontWeight: 600,
                      background: done ? "#e4e4e4" : "#000",
                      color: done ? "rgba(0,0,0,0.3)" : "#fff",
                      transition: "background 0.18s, color 0.18s",
                      flexShrink: 0,
                    }}
                  >
                    {done ? "Undo" : step.action}
                  </button>
                </div>
              );
            })}
          </div>

          {completedCount === SETUP_STEPS.length && (
            <div style={{ textAlign: "center", paddingTop: 48 }}>
              <div style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                marginBottom: 6,
              }}>
                You&apos;re all set
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 500,
                color: "rgba(0,0,0,0.4)",
              }}>
                Go find some bugs.
              </div>
            </div>
          )}
        </div>
      </Modal>


      {/* ─── FIX DETAIL — CENTER MODAL ──────────────────────── */}
      <Modal isOpen={!!selectedFix} onClose={() => setSelectedFix(null)} wide>
        {selectedFix && (
          <div style={{ padding: "48px 48px 56px" }}>
            {/* Title */}
            <h2 style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.25,
              marginBottom: 20,
              maxWidth: 500,
            }}>
              {selectedFix.title}
            </h2>

            {/* Meta row */}
            <div style={{ display: "flex", gap: 6, marginBottom: 48, flexWrap: "wrap" }}>
              <MetaPill bg={GREEN} color="#000">{selectedFix.author}</MetaPill>
              <MetaPill>{selectedFix.pr}</MetaPill>
              <MetaPill>{selectedFix.team}</MetaPill>
              <MetaPill>{selectedFix.date}</MetaPill>
              <MetaPill bg="#e8f8ea" color="#16a34a">Merged</MetaPill>
            </div>

            {/* Before / After side by side */}
            {selectedFix.before.image && selectedFix.after.image ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                marginBottom: 40,
              }}>
                <DetailPhone
                  label="Before"
                  src={selectedFix.before.image}
                  caption={selectedFix.before.label}
                />
                <DetailPhone
                  label="After"
                  src={selectedFix.after.image}
                  caption={selectedFix.after.label}
                />
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                marginBottom: 40,
              }}>
                <DetailText label="Before" text={selectedFix.before.label} />
                <DetailText label="After" text={selectedFix.after.label} />
              </div>
            )}

            {/* Component */}
            <div style={{
              padding: "18px 22px",
              background: "#f7f7f7",
              borderRadius: 18,
              display: "inline-flex",
              gap: 10,
              alignItems: "center",
            }}>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(0,0,0,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                Component
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#000", letterSpacing: "-0.02em" }}>
                {selectedFix.component}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MODAL — replaces the old side-drawer Overlay entirely.
   Centered, big border-radius, scrim click to close.
   ═══════════════════════════════════════════════════════════════ */
function Modal({
  isOpen,
  onClose,
  children,
  wide = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "scrimIn 0.2s ease",
        background: "rgba(0,0,0,0.4)",
      }}
    >
      <div style={{
        position: "relative",
        background: "#fff",
        borderRadius: 28,
        width: "100%",
        maxWidth: wide ? 760 : 580,
        maxHeight: "90vh",
        overflowY: "auto",
        animation: "modalIn 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 3,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(0,0,0,0.4)",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#e4e4e4")}
          onMouseLeave={e => (e.currentTarget.style.background = "#f0f0f0")}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   DETAIL SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function DetailPhone({ label, src, caption }: { label: string; src: string; caption: string }) {
  return (
    <div>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.3)",
        display: "block",
        marginBottom: 12,
      }}>
        {label}
      </span>
      <div style={{
        borderRadius: 22,
        overflow: "hidden",
        background: "#f2f2f2",
        aspectRatio: "9 / 19.5",
        position: "relative",
      }}>
        <Image src={src} alt={label} fill style={{ objectFit: "cover" }} sizes="340px" />
      </div>
      <div style={{
        marginTop: 10,
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(0,0,0,0.4)",
        letterSpacing: "-0.01em",
      }}>
        {caption}
      </div>
    </div>
  );
}

function DetailText({ label, text }: { label: string; text: string }) {
  return (
    <div style={{
      background: "#f7f7f7",
      borderRadius: 20,
      padding: "40px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      aspectRatio: "9 / 13",
    }}>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.25)",
        marginBottom: 12,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 18,
        fontWeight: 600,
        color: "rgba(0,0,0,0.5)",
        letterSpacing: "-0.02em",
      }}>
        {text}
      </span>
    </div>
  );
}

function NavBtn({
  onClick,
  bg,
  color,
  children,
}: {
  onClick: () => void;
  bg: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 22px",
        borderRadius: 100,
        background: bg,
        color,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

function MetaPill({
  children,
  bg = "#f0f0f0",
  color = "rgba(0,0,0,0.45)",
}: {
  children: React.ReactNode;
  bg?: string;
  color?: string;
}) {
  return (
    <span style={{
      fontSize: 13,
      fontWeight: 600,
      padding: "5px 14px",
      borderRadius: 100,
      background: bg,
      color,
      letterSpacing: "-0.01em",
    }}>
      {children}
    </span>
  );
}
