import { useState } from "react";
import { useCandidateInterviews } from "@/hooks/employer/useCandidatePool";
import "./styles/unlock-profile-modal.css";

export default function UnlockProfileModal({ candidate, onClose, onUnlock, isUnlocking }) {
  // Extract primary role from the candidate data
  const primary = candidate.roles[0];
  
  // Fetch candidate's past interview scores dynamically
  const { data: extrasData = [], isLoading } = useCandidateInterviews(candidate.id);

  // Filter out the primary interview (match by role and rounded score) and limit to max 2
  let primaryFound = false;
  let primaryInterviewId = null;
  
  const displayExtras = extrasData.filter((ex) => {
    if (!primaryFound && ex.role === primary.role && Math.round(ex.score) === primary.score) {
      primaryFound = true;
      primaryInterviewId = ex.interview_id;
      return false; // Exclude the one that matches primary
    }
    return true;
  }).slice(0, 2);

  // Track which extra interviews are checked (stores interview_id)
  const [selectedExtras, setSelectedExtras] = useState([]);

  const handleExtraToggle = (interviewId) => {
    setSelectedExtras((prev) =>
      prev.includes(interviewId)
        ? prev.filter((id) => id !== interviewId)
        : [...prev, interviewId],
    );
  };

  // Only count selected extras that are currently displayed (handles edge cases with HMR or hidden items)
  const validSelectedExtras = selectedExtras.filter((id) =>
    displayExtras.some((ex) => ex.interview_id === id)
  );

  // Dynamically calculate credits: 1 for the main profile + 1 for each extra role checked
  const totalCredits = 1 + validSelectedExtras.length;

  return (
    <div
      className="ho-modal-overlay"
      onClick={(e) => {
        // Close modal when clicking on the dark overlay background
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="up-modal">
        {/* Close Button (X) */}
        <button className="ho-modal-close" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width="16"
            height="16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="up-title">Unlock Candidate Profile</h2>
        <p className="up-subtitle">
          Unlock {candidate.name}'s Scorecard for {totalCredits} Credit
          {totalCredits > 1 ? "s" : ""}.
        </p>

        {/* Primary Role Box */}
        <div className="up-primary-box">
          <div className="up-primary-info">
            <div
              className="ho-avatar"
              style={{ background: candidate.profile_photo_url ? 'transparent' : candidate.avatarBg || '#1e293b', width: 42, height: 42, overflow: 'hidden' }}
            >
              {candidate.profile_photo_url ? (
                <img 
                  src={candidate.profile_photo_url} 
                  alt={candidate.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div style={{ display: candidate.profile_photo_url ? "none" : "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                {candidate.avatar}
              </div>
            </div>
            <div>
              <p className="up-c-name">{candidate.name}</p>
              <p className="up-c-role">
                <span className="ho-code-icon">&lt;/&gt;</span> {primary.role}
                {/* Main Highlighted Score */}
                <span className="up-score-badge">{primary.score}%</span>
              </p>
            </div>
          </div>
          {/* Primary checkbox is checked and disabled */}
          <input
            type="checkbox"
            className="up-checkbox up-checkbox--disabled"
            checked
            readOnly
          />
        </div>

        {/* Extra Roles Box (Only shows if candidate applied for multiple roles) */}
        {isLoading ? (
          <div className="up-extra-box" style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Loading interviews...</span>
          </div>
        ) : displayExtras.length > 0 ? (
          <>
            <p className="up-extra-label">
              The candidate has appeared in other interview as well
            </p>
            <div className="up-extra-box">
              {displayExtras.map((ex) => (
                <div 
                  key={ex.interview_id} 
                  className="up-extra-row"
                  onClick={() => handleExtraToggle(ex.interview_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="up-c-role">
                    <span className="ho-code-icon">&lt;/&gt;</span> {ex.role}
                    {/* Muted Sub-Score */}
                    <span className="up-score-badge-muted">{ex.score}%</span>
                  </p>
                  <input
                    type="checkbox"
                    className="up-checkbox"
                    checked={selectedExtras.includes(ex.interview_id)}
                    onChange={() => handleExtraToggle(ex.interview_id)}
                    onClick={(e) => e.stopPropagation()} // Prevent bubble to row so it doesn't toggle twice
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Footer */}
        <div className="up-footer">
          <p className="up-footer-text">
            This includes the AI Scorecard,
            <br />
            Interview Recording, and Resume.
          </p>
          <button 
            className="up-btn" 
            onClick={() => {
              if (onUnlock) {
                const finalInterviews = [primaryInterviewId, ...validSelectedExtras].filter(Boolean);
                onUnlock(candidate.id, finalInterviews, totalCredits);
              }
              else onClose();
            }}
            disabled={isUnlocking}
            style={{ opacity: isUnlocking ? 0.7 : 1, cursor: isUnlocking ? 'not-allowed' : 'pointer' }}
          >
            {isUnlocking ? "Unlocking..." : `Unlock Profile for ${totalCredits}C`}
          </button>
        </div>
      </div>
    </div>
  );
}
