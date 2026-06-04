import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

import "./EmployeeProfile.css";
import "./download-app.css";

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
      <div className="pp-personal-card da-card">
        <div className="da-icon-container">
          <i className="bi bi-shield-check da-icon" />
        </div>

        <h4 className="pp-heading da-heading">
          Download LetsHyre App
        </h4>
        
        <p className="pp-grey-text da-description">
          To start your interview, please download our secure desktop app.
          It provides a stable and distraction-free environment for your assessment.
        </p>

        {/* Feature List */}
        <div className="da-feature-list">
          <div className="da-feature-item">
            <i className="bi bi-check-circle-fill da-feature-icon"></i> Distraction-free
          </div>
          <div className="da-feature-item">
            <i className="bi bi-check-circle-fill da-feature-icon"></i> Highly stable
          </div>
          <div className="da-feature-item">
            <i className="bi bi-check-circle-fill da-feature-icon"></i> Secure workspace
          </div>
        </div>

        <a
          href="/download/letsHyre-Interview.exe"
          className="da-download-btn"
        >
          <i className="bi bi-download da-download-icon" />
          Download Application
        </a>
        
        <div className="da-os-support">
          <span>Supported OS:</span>
          <div className="da-os-icons">
            <i className="bi bi-windows" title="Windows" />
            <i className="bi bi-apple" title="Mac" />
            <i className="bi bi-ubuntu" title="Linux" />
          </div>
        </div>
      </div>
    </div>
  );
}
