import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";

export function EmployerErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let config = {
    type: "SYSTEM_PAUSE",
    title: "Talent Pipeline Interrupted",
    description:
      "We encountered a temporary synchronization issue while loading your hiring dashboard.",
    actionLabel: "Re-sync Dashboard",
    code: "500",
  };

  if (isRouteErrorResponse(error)) {
    config.code = error.status;
    if (error.status === 404) {
      config.type = "DATA_MISSING";
      config.title = "Candidate Not Found";
      config.description =
        "The specific candidate profile or requisition you are looking for is no longer available in the active pool.";
    } else if (error.status === 401) {
      config.type = "AUTH_REQUIRED";
      config.title = "Security Re-validation";
      config.description =
        "For the protection of candidate data, your employer session requires re-authentication.";
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Top Header with "System Status" feel */}
        <div style={styles.topBar}>
          <div style={styles.statusGroup}>
            <div style={styles.pulse}></div>
            <span style={styles.statusText}>SYSTEM STATUS: {config.type}</span>
          </div>
          <div style={styles.brand}>
            Lets<span>hyre</span> <small>For Employers</small>
          </div>
        </div>

        <div style={styles.mainContent}>
          <h1 style={styles.title}>{config.title}</h1>
          <p style={styles.description}>{config.description}</p>

          <div style={styles.buttonRow}>
            <button onClick={() => navigate(0)} style={styles.primaryBtn}>
              <i className="bi bi-arrow-repeat"></i> {config.actionLabel}
            </button>
            <button onClick={() => navigate(-1)} style={styles.secondaryBtn}>
              Go Back
            </button>
          </div>
        </div>

        {/* Footer with Metadata */}
        <div style={styles.footer}>
          <div style={styles.metaBox}>
            <span style={styles.metaLabel}>ERROR_ID</span>
            <span style={styles.metaValue}>
              {Math.random().toString(36).toUpperCase().slice(2, 10)}
            </span>
          </div>
          <div style={styles.metaBox}>
            <span style={styles.metaLabel}>SERVER_CODE</span>
            <span style={styles.metaValue}>{config.code}</span>
          </div>
          <div style={styles.metaBox}>
            <span style={styles.metaLabel}>SUPPORT</span>
            <span style={styles.metaValue}>Priority Line Active</span>
          </div>
        </div>
      </div>

      <style>{`
        body { margin: 0; background-color: #f1f5f9; overflow: hidden; }
        .bi-arrow-repeat { margin-right: 8px; font-size: 1.1rem; }
        @keyframes pulse-blue {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
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
    width: "100%",
    backgroundColor: "#f1f5f9", // Slightly darker slate for employer portal
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "700px",
    borderRadius: "16px", // Less rounded than employee for a more "enterprise" feel
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  statusGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  pulse: {
    width: "8px",
    height: "8px",
    backgroundColor: "#2563eb",
    borderRadius: "50%",
    animation: "pulse-blue 2s infinite",
  },
  statusText: {
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: "0.05em",
  },
  brand: {
    fontSize: "0.9rem",
    fontWeight: "800",
    color: "#0f172a",
    "& span": { color: "#2563eb" },
  },
  mainContent: {
    padding: "64px 40px",
    textAlign: "center",
  },
  title: {
    fontFamily: "var(--font-primary02)",
    fontSize: "2.25rem",
    color: "#0f172a",
    marginBottom: "16px",
    fontWeight: "600",
  },
  description: {
    fontSize: "1.1rem",
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: "40px",
    maxWidth: "500px",
    marginInline: "auto",
  },
  buttonRow: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "14px 28px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  secondaryBtn: {
    backgroundColor: "#ffffff",
    color: "#475569",
    padding: "14px 28px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontWeight: "600",
    cursor: "pointer",
  },
  footer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
  },
  metaBox: {
    padding: "20px",
    textAlign: "center",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metaLabel: {
    fontSize: "0.6rem",
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: "0.1em",
  },
  metaValue: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#475569",
  },
};
