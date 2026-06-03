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
  let primaryInterviewData = null;
  
  const displayExtras = extrasData.filter((ex) => {
    if (!primaryFound && ex.role === primary.role && Math.round(ex.score) === primary.score) {
      primaryFound = true;
      primaryInterviewData = ex;
      return false; // Exclude the one that matches primary
    }
    return true;
  }).slice(0, 2);

  // Track which interviews are checked (stores interview_id)
  const [selectedInterviews, setSelectedInterviews] = useState([]);

  const handleToggle = (interviewId, isUnlocked) => {
    if (!interviewId || isUnlocked) return; // Prevent checking if already unlocked or invalid
    setSelectedInterviews((prev) =>
      prev.includes(interviewId)
        ? prev.filter((id) => id !== interviewId)
        : [...prev, interviewId],
    );
  };

  // Dynamically calculate credits: 1 for each checked interview
  const totalCredits = selectedInterviews.length;

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
          {totalCredits !== 1 ? "s" : ""}.
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
          {/* Primary checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {primaryInterviewData?.unlocked && (
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', backgroundColor: '#dcfce7', padding: '3px 8px', borderRadius: '12px', letterSpacing: '0.02em' }}>
                Unlocked
              </span>
            )}
            <input
              type="checkbox"
              className={`up-checkbox ${(!primaryInterviewData || primaryInterviewData.unlocked) ? 'up-checkbox--disabled' : ''}`}
              checked={!!primaryInterviewData?.interview_id && selectedInterviews.includes(primaryInterviewData.interview_id)}
              disabled={!primaryInterviewData || primaryInterviewData.unlocked}
              onChange={() => handleToggle(primaryInterviewData?.interview_id, primaryInterviewData?.unlocked)}
            />
          </div>
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
                  onClick={() => handleToggle(ex.interview_id, ex.unlocked)}
                  style={{ cursor: ex.unlocked ? 'not-allowed' : 'pointer' }}
                >
                  <p className="up-c-role">
                    <span className="ho-code-icon">&lt;/&gt;</span> {ex.role}
                    {/* Muted Sub-Score */}
                    <span className="up-score-badge-muted">{ex.score}%</span>
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {ex.unlocked && (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', backgroundColor: '#dcfce7', padding: '3px 8px', borderRadius: '12px', letterSpacing: '0.02em' }}>
                        Unlocked
                      </span>
                    )}
                    <input
                      type="checkbox"
                      className={`up-checkbox ${ex.unlocked ? 'up-checkbox--disabled' : ''}`}
                      checked={selectedInterviews.includes(ex.interview_id)}
                      disabled={ex.unlocked}
                      onChange={() => handleToggle(ex.interview_id, ex.unlocked)}
                      onClick={(e) => e.stopPropagation()} // Prevent bubble to row so it doesn't toggle twice
                    />
                  </div>
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
                // Pass the selected interviews array
                onUnlock(candidate.id, selectedInterviews, totalCredits);
              }
              else onClose();
            }}
            disabled={isUnlocking || totalCredits === 0}
            style={{ opacity: (isUnlocking || totalCredits === 0) ? 0.7 : 1, cursor: (isUnlocking || totalCredits === 0) ? 'not-allowed' : 'pointer' }}
          >
            {isUnlocking ? "Unlocking..." : `Unlock Profile for ${totalCredits}C`}
          </button>
        </div>
      </div>
    </div>
  );
}
