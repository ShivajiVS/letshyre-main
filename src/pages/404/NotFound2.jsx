import React from "react";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          @keyframes slideIn {
            from { filter: blur(10px); opacity: 0; transform: scale(0.9); }
            to { filter: blur(0); opacity: 1; transform: scale(1); }
          }
          .nf-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 40px;
          }
          .nf-actions button {
            padding: 12px 28px;
            font-size: 0.9rem;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: none;
            background: #6366f1;
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .nf-actions button:hover {
            background: #4f46e5;
            transform: translateY(-3px);
            box-shadow: 0 15px 30px -10px rgba(99, 102, 241, 0.5);
          }
          .nf-actions button.secondary {
            background: rgba(255, 255, 255, 0.05);
            color: #94a3b8;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .nf-actions button.secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #f8fafc;
          }
          .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.05);
            margin-top: 20px;
            position: relative;
            overflow: hidden;
            border-radius: 2px;
          }
          .progress-fill {
            width: 40.4%;
            height: 100%;
            background: #6366f1;
            box-shadow: 0 0 15px #6366f1;
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Subtle background element */}
        <div style={styles.radarCircle} />

        <div style={styles.card}>
          <div style={styles.statusBadge}>STATUS: PAGE_NOT_HIRED</div>

          <h1 style={styles.errorCode}>404</h1>

          <div style={styles.textGroup}>
            <h2 style={styles.title}>Out of Scope.</h2>
            <p style={styles.description}>
              Just like a notice period, this page is coming to an end. We
              couldn't find the talent (or page) you were looking for.
            </p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
          <div style={styles.progressLabel}>Transition Progress: 40.4%</div>

          <div className="nf-actions">
            <button onClick={() => navigate("/")}>Go Home</button>
            <button className="secondary" onClick={handleGoBack}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0c",
    fontFamily: '"Geist", "Inter", sans-serif',
    color: "#f8fafc",
    overflow: "hidden",
    position: "relative",
  },
  container: {
    position: "relative",
    zIndex: 1,
    padding: "24px",
    animation: "slideIn 0.8s ease-out",
  },
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "60px 40px",
    borderRadius: "24px",
    textAlign: "center",
    maxWidth: "500px",
    boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)",
  },
  statusBadge: {
    fontSize: "0.7rem",
    fontWeight: "800",
    color: "#6366f1",
    letterSpacing: "2px",
    marginBottom: "16px",
    opacity: 0.8,
  },
  errorCode: {
    fontSize: "6rem",
    fontWeight: "900",
    margin: "0 0 10px 0",
    letterSpacing: "-4px",
    fontFamily: "monospace",
    textShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "12px",
  },
  description: {
    fontSize: "0.95rem",
    color: "#94a3b8",
    lineHeight: "1.6",
    margin: "0 auto",
  },
  progressLabel: {
    fontSize: "0.7rem",
    color: "#475569",
    marginTop: "8px",
    textAlign: "left",
    fontWeight: "600",
  },
  radarCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "600px",
    background:
      "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
    borderRadius: "50%",
    zIndex: -1,
    animation: "pulse 3s infinite ease-in-out",
  },
};
