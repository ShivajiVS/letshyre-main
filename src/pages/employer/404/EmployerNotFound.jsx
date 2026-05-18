import React from "react";
import { useNavigate } from "react-router";
import "./EmployerNotFound.css";

export const EmployerNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="emp-404-wrapper">
      <div className="grid-overlay" />

      <div className="emp-404-content">
        <div className="radar-container">
          <div className="radar-circle" />
          <div className="radar-sweep" />
        </div>

        <h1 className="emp-error-code">404</h1>
        <h2 className="emp-title">Talent Pool Out of Range</h2>
        <p className="emp-description">
          We couldn't locate the specific profile or dashboard you're
          requesting. The candidate might have finished their notice period or
          the link has expired.
        </p>

        <div className="emp-actions">
          <button onClick={() => navigate("/employer/dashboard")}>
            Employer Dashboard
          </button>
          <button className="secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
