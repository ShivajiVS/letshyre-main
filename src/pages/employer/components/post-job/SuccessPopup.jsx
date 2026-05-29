import React from "react";
import { useNavigate } from "react-router";
import party from "@/assets/party.png";
import check_mark from "@/assets/check-mark.png";

export function SuccessPopup({ setShowSuccess }) {
  const navigate = useNavigate();

  return (
    <div className="jd-overlay">
      <div className="jd-success-popup">
        <img src={party} className="jd-party-img" alt="Party" />
        <img src={check_mark} alt="Success" className="jd-success-icon" />
        <h2>Job Posted Successfully!</h2>
        <p>Your job has been created and is now active.</p>
        <button
          className="emp-btn-primary"
          style={{ marginTop: "20px" }}
          onClick={() => {
            setShowSuccess(false);
            navigate("/employer/view-jobs");
          }}
        >
          Continue to Jobs
        </button>
      </div>
    </div>
  );
}
