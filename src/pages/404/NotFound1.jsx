import React from "react";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .nf-actions {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 40px;
            animation: fadeIn 0.8s ease-out;
          }
          .nf-actions button {
            padding: 12px 28px;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            background-color: #0f172a;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .nf-actions button:hover {
            background-color: #1e293b;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .nf-actions button.secondary {
            background-color: transparent;
            color: #475569;
            border: 1px solid #e2e8f0;
          }
          .nf-actions button.secondary:hover {
            background-color: #f8fafc;
            border-color: #cbd5e1;
            color: #0f172a;
          }
          .nf-actions button:active {
            transform: translateY(0);
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.errorCode}>404</h1>
        </div>

        <div style={styles.content}>
          <h2 style={styles.title}>Page not found</h2>
          <p style={styles.description}>
            Sorry, we couldn’t find the page you’re looking for. Check the URL
            or head back to the dashboard.
          </p>

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
    backgroundColor: "#ffffff",
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    color: "#0f172a",
  },
  container: {
    textAlign: "center",
    padding: "24px",
    maxWidth: "500px",
  },
  hero: {
    marginBottom: "8px",
  },
  errorCode: {
    fontSize: "clamp(8rem, 25vw, 12rem)",
    fontWeight: "900",
    margin: 0,
    lineHeight: 1,
    letterSpacing: "-0.05em",
    background: "linear-gradient(180deg, #0f172a 30%, #64748b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "float 6s ease-in-out infinite",
  },
  content: {
    animation: "fadeIn 0.6s ease-out",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "16px",
    letterSpacing: "-0.02em",
  },
  description: {
    fontSize: "1.1rem",
    color: "#64748b",
    lineHeight: "1.6",
    margin: 0,
  },
};
