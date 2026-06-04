import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { motion } from "framer-motion";

import "./EmployeeProfile.css";
import "./download-app.css";

export function DownloadApp() {
  const [os, setOs] = useState("Windows");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      setOs("Mac");
    } else if (userAgent.includes("linux") || userAgent.includes("ubuntu")) {
      setOs("Linux");
    } else {
      setOs("Windows");
    }
  }, []);

  const getDownloadLink = () => {
    if (os === "Mac") return "/download/letsHyre-Interview.dmg";
    if (os === "Linux") return "/download/letsHyre-Interview.AppImage";
    return "/download/letsHyre-Interview.exe";
  };

  const getDownloadText = () => {
    if (os === "Mac") return "Download for Mac";
    if (os === "Linux") return "Download for Linux";
    return "Download for Windows";
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="pp-wrapper">
      <Helmet>
        <title>Download LetsHyre App — Secure Interview Environment</title>
        <meta
          name="description"
          content="Download the LetsHyre desktop application to start your secure AI interview session. Available for Windows, Mac, and Linux."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://letshyre.ai/download" />
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
      <motion.div
        className="pp-personal-card da-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="da-icon-container" variants={itemVariants}>
          <i className="bi bi-shield-check da-icon" />
        </motion.div>

        <motion.h4 className="pp-heading da-heading" variants={itemVariants}>
          Download <span className="da-text-gradient">LetsHyre</span> Application
        </motion.h4>

        <motion.p
          className="pp-grey-text da-description"
          variants={itemVariants}
        >
          To start your interview, please download our secure desktop app. It
          provides a stable and distraction-free environment for your
          assessment.
        </motion.p>

        {/* Feature List */}
        <motion.div className="da-feature-list" variants={itemVariants}>
          <div className="da-feature-item">
            <i className="bi bi-check-circle-fill da-feature-icon"></i>{" "}
            Distraction-free
          </div>
          <div className="da-feature-item">
            <i className="bi bi-check-circle-fill da-feature-icon"></i> Highly
            stable
          </div>
          <div className="da-feature-item">
            <i className="bi bi-check-circle-fill da-feature-icon"></i> Secure
            workspace
          </div>
        </motion.div>

        <motion.a
          href={getDownloadLink()}
          className="da-download-btn"
          variants={itemVariants}
        >
          <i className="bi bi-download da-download-icon" />
          {getDownloadText()}
        </motion.a>

        <motion.div className="da-os-support" variants={itemVariants}>
          <span>Supported OS:</span>
          <div className="da-os-icons">
            <i
              className={`bi bi-windows ${os === "Windows" ? "active" : ""}`}
              title="Windows"
              style={{ cursor: "pointer" }}
              onClick={() => setOs("Windows")}
            />
            <i
              className={`bi bi-apple ${os === "Mac" ? "active" : ""}`}
              title="Mac"
              style={{ cursor: "pointer" }}
              onClick={() => setOs("Mac")}
            />
            <i
              className={`bi bi-ubuntu ${os === "Linux" ? "active" : ""}`}
              title="Linux"
              style={{ cursor: "pointer" }}
              onClick={() => setOs("Linux")}
            />
          </div>
        </motion.div>

        {/* Stepper Guide */}
        <motion.div className="da-stepper" variants={itemVariants}>
          <div className="da-step active">
            <div className="da-step-number">1</div>
            <span>Download</span>
          </div>
          <div className="da-step-divider" />
          <div className="da-step">
            <div className="da-step-number">2</div>
            <span>Install</span>
          </div>
          <div className="da-step-divider" />
          <div className="da-step">
            <div className="da-step-number">3</div>
            <span>Interview</span>
          </div>
        </motion.div>

        {/* Support Link */}
        <motion.a
          href="/support"
          className="da-support-link"
          variants={itemVariants}
        >
          <i className="bi bi-question-circle" /> Having trouble? View
          installation guide
        </motion.a>
      </motion.div>
    </div>
  );
}
