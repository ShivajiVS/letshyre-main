import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
// Using the standard employee flow CSS to guarantee perfect layout synchronization
import "./EmployeeProfile.css";

export function DownloadApp() {
  return (
    <div className="pp-wrapper">
      <Helmet>
        <title>Download LetsHyre App — Secure Interview Environment</title>
        <meta
          name="description"
          content="Download the LetsHyre desktop application to start your secure AI interview session. Available for Windows, Mac, and Linux."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://letshyre.com/download" />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="pp-hero">
        <div className="pp-hero-bg-text">LETSHYRE</div>
        <Link to={-1} className="go-back-btn">
          <i className="bi bi-arrow-left" />
          <span className="go-back">Go Back</span>
        </Link>
      </div>

      {/* ── MAIN CONTENT CARD ─────────────────────────────── */}
      <div 
        className="pp-personal-card" 
        style={{ 
          maxWidth: "600px", 
          margin: "60px auto", 
          textAlign: "center",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div 
          style={{ 
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px"
          }}
        >
          <i 
            className="bi bi-shield-check" 
            style={{ fontSize: "2.5rem", color: "#2563eb" }}
          />
        </div>

        <h4 className="pp-heading" style={{ fontSize: "1.75rem", marginBottom: "12px", color: "#0f172a" }}>
          Download LetsHyre App
        </h4>
        
        <p className="pp-grey-text" style={{ fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "32px", maxWidth: "450px" }}>
          To start your interview, please download our secure desktop app.
          It provides a stable and distraction-free environment for your assessment.
        </p>

        {/* Feature List */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "40px", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
            <i className="bi bi-check-circle-fill" style={{ color: "#22c55e" }}></i> Distraction-free
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
            <i className="bi bi-check-circle-fill" style={{ color: "#22c55e" }}></i> Highly stable
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
            <i className="bi bi-check-circle-fill" style={{ color: "#22c55e" }}></i> Secure workspace
          </div>
        </div>

        <a
          href="/download/letsHyre-Interview.exe"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            padding: "16px 36px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "1.1rem",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 8px 16px -4px rgba(37, 99, 235, 0.25)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 20px -4px rgba(37, 99, 235, 0.4)";
            e.currentTarget.style.background = "#1d4ed8";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 8px 16px -4px rgba(37, 99, 235, 0.25)";
            e.currentTarget.style.background = "#2563eb";
          }}
        >
          <i className="bi bi-download" style={{ fontSize: "1.2rem" }} />
          Download Application
        </a>
        
        <div style={{ marginTop: "24px", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "12px" }}>
          <span>Supported OS:</span>
          <div style={{ display: "flex", gap: "10px", fontSize: "1.1rem", color: "#64748b" }}>
            <i className="bi bi-windows" title="Windows" />
            <i className="bi bi-apple" title="Mac" />
            <i className="bi bi-ubuntu" title="Linux" />
          </div>
        </div>
      </div>
    </div>
  );
}
