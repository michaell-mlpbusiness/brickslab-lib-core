import React from "react";
import { motion } from "framer-motion";
import type { SignatureDetailsProps } from "./SignatureDetails.type";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = `
  .bl-sig-section { background: var(--c-surface); }
  .bl-sig-container { max-width: var(--container-max); margin: auto; padding: 0 var(--spacing-xl); }
  .bl-sig-header {
    text-align: center;
    max-width: var(--content-max);
    margin: 0 auto var(--spacing-3xl);
  }
  .bl-sig-header h2 { font-size: clamp(var(--fontsize-6xl), 6vw, var(--fontsize-8xl)); margin-bottom: var(--spacing-lg); }
  .bl-sig-header p  { font-size: var(--fontsize-lg); opacity: 0.7; }
  .bl-sig-grid {
    display: grid;
    gap: var(--spacing-xl);
    grid-template-columns: repeat(var(--bl-sig-columns, 4), minmax(0, 1fr));
  }
  .bl-sig-card { position: relative; overflow: hidden; cursor: pointer; will-change: transform; }
  .bl-sig-img-wrap { overflow: hidden; background: var(--c-surface-inverse); }
  .bl-sig-img-wrap img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
  .bl-sig-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: var(--spacing-xl);
    color: white;
    text-align: center;
    will-change: opacity;
  }
  .bl-sig-overlay h3 { font-size: var(--fontsize-xl); margin-bottom: var(--spacing-md); }
  .bl-sig-overlay p  { font-size: var(--fontsize-sm); opacity: 0.85; }
  .bl-sig-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--spacing-lg);
    background: linear-gradient(to top, var(--c-overlay-dark), transparent);
    color: white;
    text-align: center;
  }

  @media (max-width: var(--breakpoint-lg)) {
    .bl-sig-container { padding: 0 var(--spacing-md); }
    .bl-sig-header { margin: 0 auto var(--spacing-2xl); }
    .bl-sig-grid {
      gap: var(--spacing-md);
      grid-template-columns: repeat(var(--bl-sig-columns-tablet, 2), minmax(0, 1fr));
    }
  }

  @media (max-width: var(--breakpoint-sm)) {
    .bl-sig-container { padding: 0 var(--spacing-sm); }
    .bl-sig-header { margin: 0 auto var(--spacing-xl); }
    .bl-sig-header p { font-size: var(--fontsize-lg); }
    .bl-sig-overlay { padding: var(--spacing-lg); }
    .bl-sig-overlay h3 { font-size: var(--fontsize-lg); }
    .bl-sig-grid {
      gap: var(--spacing-md);
      grid-template-columns: repeat(var(--bl-sig-columns-mobile, 1), minmax(0, 1fr));
    }
  }
`;

// ---------------------------------------------------------------------------
// Variants framer-motion (propagation depuis la carte parente)
// ---------------------------------------------------------------------------

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.5 } },
};

const overlayVariants = {
  rest:  { opacity: 0 },
  hover: { opacity: 1 },
};

const titleVariants = {
  rest:  { opacity: 1 },
  hover: { opacity: 0 },
};

const cardVariants = {
  rest: { opacity: 1, y: 0 },
  hover: { opacity: 1, y: 0 },
};

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function SignatureDetails({
  details,
  title = "Détails Signature",
  subtitle = "Chaque pièce est définie par un savoir-faire méticuleux et des matériaux d'exception.",
  columns = 4,
  cardRadius = "4px",
  sectionPadding = "8rem 0",
  overlayColor,
  imageAspectRatio = "3/4",
  className = "",
}: SignatureDetailsProps) {
  const tabletColumns = Math.min(columns, 2);
  const mobileColumns = 1;

  const overlayStyle = overlayColor
    ? `linear-gradient(to top, ${overlayColor}, transparent)`
    : "var(--c-overlay-gradient)";

  return (
    <>
      <style>{styles}</style>

      <section
        className={`bl-sig-section${className ? ` ${className}` : ""}`}
        style={{ 
          padding: sectionPadding,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="bl-sig-container">

          {/* Header */}
          <motion.div
            className="bl-sig-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </motion.div>

          {/* Grid */}
          <div
            className="bl-sig-grid"
            style={
              {
                "--bl-sig-columns": columns,
                "--bl-sig-columns-tablet": tabletColumns,
                "--bl-sig-columns-mobile": mobileColumns,
                display: "grid",
              } as React.CSSProperties
            }
          >
            {details.map((detail, index) => (
              <motion.div
                key={detail.id}
                className="bl-sig-card"
                style={{ borderRadius: cardRadius }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover="hover"
                animate="rest"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                variants={cardVariants}
              >
                <div
                  className="bl-sig-img-wrap"
                  style={{ aspectRatio: imageAspectRatio, borderRadius: cardRadius }}
                >
                  <motion.img
                    src={detail.image}
                    alt={detail.title}
                    variants={imageVariants}
                    draggable={false}
                    style={{ willChange: "transform" }}
                  />
                </div>

                {/* Overlay au survol */}
                <motion.div
                  className="bl-sig-overlay"
                  style={{
                    background: overlayStyle,
                    borderRadius: cardRadius,
                    willChange: "opacity",
                  }}
                  variants={overlayVariants}
                >
                  <h3>{detail.title}</h3>
                  <p>{detail.description}</p>
                </motion.div>

                {/* Titre par défaut (masqué au survol) */}
                <motion.div className="bl-sig-title" variants={titleVariants}>
                  <h3>{detail.title}</h3>
                </motion.div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
