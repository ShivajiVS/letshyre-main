import React from "react";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @keyframes reveal {
            0% { opacity: 0; transform: translateY(20px); filter: blur(10px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes border-glow {
            0%, 100% { border-color: rgba(99, 102, 241, 0.2); }
            50% { border-color: rgba(99, 102, 241, 0.6); }
          }
          @keyframes mesh-float {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(5%, 5%) scale(1.1); }
            100% { transform: translate(0, 0) scale(1); }
          }
          .nf-actions {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 48px;
          }
          .nf-actions button {
            padding: 14px 32px;
            font-size: 0.85rem;
            font-weight: 700;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            border: none;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .btn-primary {
            background: #6366f1;
            color: #ffffff;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
          }
          .btn-primary:hover {
            background: #818cf8;
            transform: translateY(-2px);
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
          }
          .btn-secondary {
            background: rgba(255, 255, 255, 0.03);
            color: #f8fafc;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(5px);
          }
          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.3) !important;
          }
          .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.05);
            margin: 32px 0 8px;
            position: relative;
            overflow: hidden;
            border-radius: 10px;
          }
          .progress-fill {
            width: 40.4%;
            height: 100%;
            background: linear-gradient(90deg, #6366f1, #a855f7);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
            border-radius: 10px;
          }
        `}
      </style>

      {/* Modern Mesh Background */}
      <div style={styles.meshGradient} />

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <span style={styles.statusBadge}>TERMINAL_ERROR_404</span>
            <span style={styles.latency}>LATENCY: 12ms</span>
          </div>

          <h1 style={styles.errorCode}>404</h1>

          <div style={styles.textGroup}>
            <h2 style={styles.title}>Offer Rescinded by Reality.</h2>
            <p style={styles.description}>
              We couldn't source the page you're looking for. It might be on a
              different branch or its notice period finally ended.
            </p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
          <div style={styles.progressLabel}>
            <span>NOTICE_PERIOD_REMAINING</span>
            <span>40.4%</span>
          </div>

          <div className="nf-actions">
            <button className="btn-primary" onClick={() => navigate("/")}>
              Return to Base
            </button>
            <button className="btn-secondary" onClick={handleGoBack}>
              Previous State
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
    backgroundColor: "#020617", // Slate 950
    fontFamily: '"Inter", system-ui, sans-serif',
    color: "#f8fafc",
    overflow: "hidden",
    position: "relative",
  },
  meshGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.15) 0px, transparent 50%)
    `,
    zIndex: 0,
    animation: "mesh-float 10s infinite alternate",
  },
  container: {
    position: "relative",
    zIndex: 1,
    padding: "24px",
    animation: "reveal 1s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  card: {
    background: "rgba(15, 23, 42, 0.6)", // Slate 900
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    padding: "48px",
    borderRadius: "32px",
    textAlign: "center",
    maxWidth: "540px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    animation: "border-glow 4s infinite",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    fontFamily: "monospace",
    opacity: 0.6,
    fontSize: "0.65rem",
    letterSpacing: "1px",
  },
  statusBadge: {
    color: "#818cf8",
    fontWeight: "700",
  },
  errorCode: {
    fontSize: "9rem",
    fontWeight: "900",
    margin: "0",
    lineHeight: "0.8",
    background: "linear-gradient(180deg, #f8fafc 0%, #475569 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.05em",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    marginBottom: "16px",
    color: "#f1f5f9",
    letterSpacing: "-0.02em",
  },
  description: {
    fontSize: "1rem",
    color: "#94a3b8",
    lineHeight: "1.7",
    fontWeight: "400",
  },
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "monospace",
    fontSize: "0.7rem",
    color: "#6366f1",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
};
