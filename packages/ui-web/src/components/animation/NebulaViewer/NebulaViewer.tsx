import React from "react";
import type { NebulaViewerProps } from "./NebulaViewer.type";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = `
  .bl-nebula-wrapper {
    --color-neutral-900: var(--color-neutral-900);
    --color-neutral-700: var(--color-neutral-700);
    --color-white: var(--color-white);
    --color-white-alpha-50: var(--color-white-alpha-50);
    --color-white-alpha-60: var(--color-white-alpha-60);
    --color-black-alpha-20: var(--color-black-alpha-20);
    --radius-full: var(--radius-full);
    --radius-lg: var(--radius-lg);
    --viewer-width: var(--viewer-width);
    --halo-size: var(--halo-size);

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 5rem;
    padding: 5rem;
    min-height: 100vh;
    box-sizing: border-box;
    max-width: 100%;
  }
  .bl-nebula-info { max-width: 420px; flex: 0 1 auto; }
  .bl-nebula-info h1 { font-size: 60px; margin-bottom: 20px; }
  .bl-nebula-info p  { font-size: 18px; opacity: .7; margin-bottom: 30px; }
  .bl-nebula-cta {
    display: inline-block;
    padding: 14px 30px;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--color-neutral-900), var(--color-neutral-700));
    color: var(--color-white);
    text-decoration: none;
    font-weight: 600;
  }
  .bl-nebula-viewer-box { position: relative; aspect-ratio: 1; max-width: 100%; }
  .bl-nebula-halo {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, var(--color-white), transparent 70%);
    filter: blur(80px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    will-change: transform;
    width: var(--halo-size);
    height: var(--halo-size);
  }
  .bl-nebula-viewer-box model-viewer { width: 100%; height: 100%; z-index: 1; }
  .bl-nebula-shadow {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 55%;
    height: 40px;
    border-radius: 50%;
    background: var(--color-black-alpha-20);
    filter: blur(25px);
  }
  .bl-nebula-options {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
  }
  .bl-nebula-opt {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid var(--color-white-alpha-50);
  }
  .bl-nebula-opt.active { border: 2px solid var(--color-neutral-900); }
  .bl-nebula-pause-btn {
    position: absolute;
    right: -70px;
    top: 50%;
    transform: translateY(-50%);
    width: 55px;
    height: 55px;
    border-radius: var(--radius-full);
    border: none;
    background: var(--color-white-alpha-60);
    cursor: pointer;
    will-change: transform;
  }
  @media (max-width: 64rem) {
    .bl-nebula-wrapper {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2.5rem;
      gap: 2.5rem;
    }
    .bl-nebula-info { max-width: 90%; }
    .bl-nebula-info h1 { font-size: 40px; }
    .bl-nebula-info p  { font-size: 16px; }
    .bl-nebula-viewer-box { width: 90%; max-width: 28rem; }
    .bl-nebula-pause-btn { right: 10px; top: -70px; transform: none; }
    .bl-nebula-options { bottom: -40px; }
  }
  @media (max-width: 40rem) {
    .bl-nebula-wrapper { padding: 1.25rem; gap: 1.25rem; }
    .bl-nebula-info h1 { font-size: 32px; }
    .bl-nebula-info p  { font-size: 14px; }
    .bl-nebula-cta { padding: 10px 24px; font-size: 14px; }
    .bl-nebula-viewer-box { width: 100%; }
  }
`;

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function NebulaViewer({
  title = "Nebula",
  description = "Découvrez vos modèles 3D dans une expérience immersive et fluide.",
  ctaLabel = "Découvrir",
  ctaLink = "#",
  models,
  isRotating = true,
  onRotateChange,
  selectedModel,
  onModelChange,
  viewerWidth = "650px",
  haloSize = "500px",
  showPauseButton = true,
  className = "",
}: NebulaViewerProps) {
  const activeSrc = selectedModel ?? models[0]?.src;

  return (
    <>
      <style>{styles}</style>

      <section
        className={`bl-nebula-wrapper${className ? ` ${className}` : ""}`}
        style={
          {
            ["--viewer-width" as string]: viewerWidth,
            ["--halo-size" as string]: haloSize,
          } as React.CSSProperties
        }
      >

        {/* TEXT */}
        <div className="bl-nebula-info">
          <h1>{title}</h1>
          <p>{description}</p>
          <a className="bl-nebula-cta" href={ctaLink}>
            {ctaLabel}
          </a>
        </div>

        {/* VIEWER */}
        <div className="bl-nebula-viewer-box">
          <div className="bl-nebula-halo" />

          <model-viewer
            src={activeSrc}
            camera-controls
            shadow-intensity="1"
            exposure="1"
            environment-image="neutral"
            {...(isRotating ? { "auto-rotate": "" } : {})}
          />

          <div className="bl-nebula-shadow" />

          {/* OPTIONS */}
          <div className="bl-nebula-options">
            {models.map((model, i) => (
              <div
                key={i}
                className={`bl-nebula-opt${activeSrc === model.src ? " active" : ""}`}
                style={{ background: model.color }}
                onClick={() => onModelChange?.(model.src)}
              />
            ))}
          </div>

          {/* PAUSE */}
          {showPauseButton && (
            <button
              className="bl-nebula-pause-btn"
              onClick={() => onRotateChange?.(!isRotating)}
              aria-label={isRotating ? "Mettre en pause la rotation" : "Reprendre la rotation"}
            >
              {isRotating ? "⏸" : "▶"}
            </button>
          )}
        </div>

      </section>
    </>
  );
}
