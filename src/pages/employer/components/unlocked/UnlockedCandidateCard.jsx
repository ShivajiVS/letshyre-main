import React from "react";
import { Link } from "react-router";

/**
 * Get initials from name for fallback avatar
 */
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0]?.toUpperCase() || "?";
};

export const UnlockedCandidateCard = ({ candidate }) => {
  // Format the unlock date
  const unlockDate = new Date(candidate.unlocked_date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <article className="uc-card">
      <div className="uc-card-header">
        <div className="uc-avatar-wrapper">
          {candidate.candidate_profile_photo ? (
            <img
              src={candidate.candidate_profile_photo}
              alt={`${candidate.candidate_name}'s photo`}
              className="uc-avatar"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="uc-avatar-fallback"
            style={{
              display: candidate.candidate_profile_photo ? "none" : "flex",
            }}
          >
            {getInitials(candidate.candidate_name)}
          </div>
        </div>

        <div className="uc-info">
          <h3 className="uc-name">{candidate.candidate_name}</h3>
          <p className="uc-unlock-date">
            <i className="bi bi-unlock-fill"></i> Unlocked on {unlockDate}
          </p>
        </div>

        {/* Overall AI Score Ring / Badge */}
        <div className="uc-score-badge" title="Overall AI Score">
          <span>
            {Math.round(parseFloat(candidate.ai_overall_score || 0))}%
          </span>
        </div>
      </div>

      <div className="uc-card-body">
        {/* Contact Info (Since it's unlocked, we show email/phone) */}
        <div className="uc-contact-info">
          <div className="uc-contact-item">
            <i className="bi bi-envelope"></i>
            <span>{candidate.candidate_email}</span>
          </div>
          <div className="uc-contact-item">
            <i className="bi bi-telephone"></i>
            <span>{candidate.candidate_phone}</span>
          </div>
        </div>

        {/* Experience & Location */}
        <div className="uc-meta-grid">
          <div className="uc-meta-item">
            <i className="bi bi-briefcase"></i>
            <span>
              {candidate.candidate_total_experience_years || 0} Yrs Exp
            </span>
          </div>
          <div className="uc-meta-item">
            <i className="bi bi-geo-alt"></i>
            <span>{candidate.candidate_location || "Not specified"}</span>
          </div>
        </div>

        {/* CTC Information */}
        <div className="uc-ctc-box">
          <div className="uc-ctc-item">
            <span className="uc-ctc-label">Current CTC</span>
            <span className="uc-ctc-value">
              {candidate.candidate_current_ctc
                ? `₹${(candidate.candidate_current_ctc / 100000).toFixed(1)}L`
                : "N/A"}
            </span>
          </div>
          <div className="uc-ctc-divider"></div>
          <div className="uc-ctc-item">
            <span className="uc-ctc-label">Expected CTC</span>
            <span className="uc-ctc-value">
              {candidate.candidate_expected_ctc
                ? `₹${(candidate.candidate_expected_ctc / 100000).toFixed(1)}L`
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="uc-card-footer">
        <Link
          to={`/employer/employee-score-card?candidate=${candidate.candidate}`}
          className="uc-btn-primary"
        >
          View Scorecard <i className="bi bi-arrow-right"></i>
        </Link>
        {candidate.candidate_resume && (
          <a
            href={candidate.candidate_resume}
            target="_blank"
            rel="noopener noreferrer"
            className="uc-btn-secondary"
            title="Download Resume"
          >
            <i className="bi bi-file-earmark-pdf"></i>
          </a>
        )}
      </div>
    </article>
  );
};
