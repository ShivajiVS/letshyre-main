import React from "react";
import "./styles/profile-status-modal.css";

const ProfileStatusModal = ({ isRejected, rejectionReason, onLogout, isLoggingOut }) => {
  return (
    <div className="psm-overlay">
      <div className="psm-modal-card">
        {isRejected ? (
          <>
            <div className="psm-icon-container rejected">
              <i className="bi bi-x-circle"></i>
            </div>
            <h2 className="psm-title">Profile Rejected</h2>
            <p className="psm-description">
              Unfortunately, your profile could not be approved at this time.
              Please review the reason below and update your profile
              accordingly.
            </p>
            {rejectionReason && (
              <div className="psm-reason-box">
                <div className="psm-reason-label">Reason for Rejection</div>
                <p className="psm-reason-text">"{rejectionReason}"</p>
              </div>
            )}
            {/* The user can either update profile or contact support. For now, a simple acknowledge button or update button */}
            <button
              className="psm-action-button"
              onClick={onLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <div className="psm-icon-container pending">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <h2 className="psm-title">Profile Under Review</h2>
            <p className="psm-description">
              Your profile is currently pending approval. Our team is reviewing
              your details to ensure everything is in order. We'll notify you
              once your account is approved.
            </p>
            <button
              className="psm-action-button"
              onClick={onLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileStatusModal;
