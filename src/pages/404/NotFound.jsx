import React from "react";
import { useNavigate } from "react-router";
import "./NotFound.css";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <div className="global-404-container">
      <main className="global-404-content">
        <div className="global-404-mesh-bg"></div>
        
        <div className="global-404-card">
          <div className="global-404-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="global-404-badge">
            <span className="global-404-badge-dot"></span>
            404 Not Found
          </div>

          <h1 className="global-404-title">
            <span className="global-text-gradient">We couldn't find this page</span>
          </h1>
          <p className="global-404-description">
            The page you're looking for doesn't exist or might have been moved. 
            Let's get you back on track.
          </p>

          <div className="global-404-actions">
            <button
              onClick={() => navigate("/")}
              className="global-404-btn-primary"
            >
              Go Home
            </button>
            <button 
              onClick={handleGoBack} 
              className="global-404-btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
