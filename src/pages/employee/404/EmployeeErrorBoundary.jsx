import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";

export function EmployeeErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let config = {
    category: "System",
    title: "An unexpected hurdle",
    description:
      "We've encountered a minor interruption while preparing your dashboard.",
    code: "ERR_SIG",
    isFatal: false,
  };

  if (isRouteErrorResponse(error)) {
    config.code = `HTTP_${error.status}`;
    if (error.status === 404) {
      config.category = "Navigation";
      config.title = "Lost in transition";
      config.description =
        "The placement or profile you're looking for is no longer at this address.";
    } else if (error.status === 401) {
      config.category = "Security";
      config.title = "Session expired";
      config.description =
        "For your security, please re-authenticate to continue your journey.";
    }
  } else if (error instanceof Error) {
    config.isFatal = true;
    config.title = "Rendering error";
    config.description =
      "A technical exception occurred. Our engineers have been alerted.";
    config.debug = error.message;
  }

  return (
    <div style={styles.container}>
      {/* Background Typography - Constrained to prevent scrollbars */}
      <div style={styles.bgLogo}>L</div>

      <div style={styles.wrapper}>
        <nav style={styles.nav}>
          <span style={styles.navItem}>Letshyre</span>
          <span style={styles.navSep}>/</span>
          <span style={{ ...styles.navItem, color: "#0f172a" }}>
            {config.category}
          </span>
        </nav>

        <h1 style={styles.title}>{config.title}</h1>
        <p style={styles.description}>{config.description}</p>

        {config.isFatal && (
          <div style={styles.console}>
            <div style={styles.consoleHeader}>
              <span style={styles.consoleDot}></span>
              Runtime Trace
            </div>
            <code style={styles.code}>{config.debug}</code>
          </div>
        )}

        <div style={styles.footer}>
          <div style={styles.actionGroup}>
            <button
              onClick={() => navigate(0)}
              style={styles.btnPrimary}
              className="btn-hover"
            >
              Refresh View
            </button>
            <button onClick={() => navigate(-1)} style={styles.btnSecondary}>
              Back to Safety
            </button>
          </div>

          <div style={styles.meta}>
            <span style={styles.errorCode}>{config.code}</span>
            <span style={styles.support}>
              Support ID: {Math.random().toString(36).toUpperCase().slice(2, 8)}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        body { 
          margin: 0; 
          overflow: hidden; /* Prevents global scrolling */
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-hover:hover {
          background-color: #1d4ed8 !important;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width:
      "100%" /* Changed from 100vw to 100% to avoid scrollbar math errors */,
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    position: "fixed" /* Locks the view in place */,
    top: 0,
    left: 0,
    overflow: "hidden" /* Final insurance against scrollbars */,
    color: "#475569",
  },
  bgLogo: {
    position: "absolute",
    fontSize: "60vh",
    fontWeight: "900",
    color: "#f8fafc",
    left: "-5vh",
    bottom: "-10vh",
    zIndex: 0,
    userSelect: "none",
    pointerEvents: "none" /* Ensures it doesn't block clicks */,
    fontFamily: "var(--font-primary02)",
    lineHeight: 1,
  },
  wrapper: {
    position: "relative",
    zIndex: 1,
    maxWidth: "600px",
    width: "90%" /* Responsive width */,
    padding: "20px",
    animation: "reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
    fontSize: "0.75rem",
    fontWeight: "700",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  navItem: { color: "#cbd5e1" },
  navSep: { color: "#f1f5f9" },
  title: {
    fontFamily: "var(--font-primary02)",
    fontSize: "clamp(2rem, 8vw, 3.5rem)" /* Responsive fluid typography */,
    color: "#0f172a",
    marginBottom: "24px",
    lineHeight: "1.1",
    fontWeight: "400",
  },
  description: {
    fontSize: "1.15rem",
    lineHeight: "1.6",
    color: "#64748b",
    marginBottom: "48px",
    maxWidth: "480px",
  },
  console: {
    backgroundColor: "#0f172a",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "48px",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.1)",
    maxWidth: "100%",
    overflow: "hidden",
  },
  consoleHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#94a3b8",
    fontSize: "0.65rem",
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: "12px",
  },
  consoleDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#38bdf8",
    borderRadius: "50%",
  },
  code: {
    color: "#e2e8f0",
    fontFamily: "monospace",
    fontSize: "0.85rem",
    wordBreak: "break-all",
    display: "block",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  actionGroup: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
    flexWrap: "wrap" /* Prevents buttons from overflowing on small screens */,
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "16px 36px",
    borderRadius: "100px",
    border: "none",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  btnSecondary: {
    backgroundColor: "transparent",
    color: "#0f172a",
    fontSize: "0.95rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "6px",
    padding: "8px 0",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "24px",
    borderTop: "1px solid #f1f5f9",
    fontSize: "0.7rem",
    color: "#cbd5e1",
    fontWeight: "600",
  },
  errorCode: { color: "#94a3b8" },
};
