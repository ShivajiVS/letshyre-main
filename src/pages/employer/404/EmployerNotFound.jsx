import React from "react";
import { useNavigate, Link } from "react-router";
import logo from "@/assets/logo2.png";
import "../styles/EmployerNotFound.css";

export const EmployerNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="employer-404-container">


      <main className="employer-404-content">
        <div className="employer-404-glow"></div>
        
        <div className="employer-404-card">
          <div className="employer-404-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="employer-404-badge">
            <span className="employer-404-badge-dot"></span>
            404 Not Found
          </div>

          <h1 className="employer-404-title">
            <span className="employer-text-gradient">We couldn't find this page</span>
          </h1>
          <p className="employer-404-description">
            The page you're looking for doesn't exist or might have been moved. 
            If you followed a link to a candidate's profile, it may have expired.
          </p>

          <div className="employer-404-actions">
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="employer-404-btn-primary"
            >
              Employer Dashboard
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="employer-404-btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
