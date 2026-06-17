import React from "react";
import logoutImg from "@/assets/logout.png";

const LogoutModal = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout-close" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </div>
        <img src={logoutImg} alt="Logout" className="logout-img" />
        <h3>Oh no, you're leaving</h3>
        <p>Are you sure you want to logout?</p>
        <div className="logout-actions">
          <button
            className="logout-no"
            onClick={onClose}
            disabled={isLoggingOut}
          >
            Naah!
          </button>
          <button
            className="logout-yes"
            onClick={onConfirm}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Yes, Log me out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
