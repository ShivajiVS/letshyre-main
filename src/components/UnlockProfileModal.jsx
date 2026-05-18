import { useState } from "react";

export default function UnlockProfileModal({ candidate, onClose }) {
  // Extract primary role and any extra roles from the candidate data
  const [primary, ...extras] = candidate.roles;

  // Track which extra roles are checked (primary is always checked visually)
  const [selectedExtras, setSelectedExtras] = useState([]);

  const handleExtraToggle = (roleName) => {
    setSelectedExtras((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName],
    );
  };

  // Dynamically calculate credits: 1 for the main profile + 1 for each extra role checked
  const totalCredits = 1 + selectedExtras.length;

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
              style={{ background: candidate.avatarBg, width: 42, height: 42 }}
            >
              {candidate.avatar}
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
        {extras.length > 0 && (
          <>
            <p className="up-extra-label">
              The candidate has appeared in other interview as well
            </p>
            <div className="up-extra-box">
              {extras.map((ex) => (
                <div key={ex.role} className="up-extra-row">
                  <p className="up-c-role">
                    <span className="ho-code-icon">&lt;/&gt;</span> {ex.role}
                    {/* Muted Sub-Score */}
                    <span className="up-score-badge-muted">{ex.score}%</span>
                  </p>
                  <input
                    type="checkbox"
                    className="up-checkbox"
                    checked={selectedExtras.includes(ex.role)}
                    onChange={() => handleExtraToggle(ex.role)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="up-footer">
          <p className="up-footer-text">
            This includes the AI Scorecard,
            <br />
            Interview Recording, and Resume.
          </p>
          <button className="up-btn" onClick={onClose}>
            Unlock Profile for {totalCredits}C
          </button>
        </div>
      </div>
    </div>
  );
}
