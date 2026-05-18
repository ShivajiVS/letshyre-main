import React from "react";
import { useNavigate } from "react-router";
import "./NotFound.css";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <div className="nf-wrapper">
      <div className="nf-container">
        <div className="nf-status-box">
          <span className="nf-status-text">Notice Period Connection: 404</span>
          <div className="nf-line-track">
            <div className="nf-line-moving" />
          </div>
        </div>

        <h1 className="nf-error-code">404</h1>
        <h2 className="nf-title">Page Not Found</h2>
        <p className="nf-description">
          The career transition you're looking for isn't at this address. Let's
          get you back to the talent pool.
        </p>

        <div className="nf-actions">
          <button onClick={() => navigate("/")}>Go Home</button>
          <button className="secondary" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="nf-glow" />
    </div>
  );
};
