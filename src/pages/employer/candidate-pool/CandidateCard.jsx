/**
 * CandidateCard — Rich candidate card for the Candidate Pool page.
 *
 * Displays candidate profile, AI match score (circular ring), skills,
 * role/skills match bars, rationale, and interview info.
 *
 * @param {object} candidate - Candidate match object from the API
 * @param {function} onViewProfile - Callback when card is clicked
 */

/** SVG circular progress ring */
const ScoreRing = ({ score }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(Math.max(score || 0, 0), 100);
  const offset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = "cp-score-ring-fill--low";
  if (normalizedScore >= 70) colorClass = "cp-score-ring-fill--high";
  else if (normalizedScore >= 40) colorClass = "cp-score-ring-fill--medium";

  return (
    <div className="cp-score-ring" aria-label={`Match score: ${normalizedScore}%`}>
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle
          className="cp-score-ring-bg"
          cx="28"
          cy="28"
          r={radius}
        />
        <circle
          className={`cp-score-ring-fill ${colorClass}`}
          cx="28"
          cy="28"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="cp-score-value">
        {Math.round(normalizedScore)}
      </span>
    </div>
  );
};

/** Mini progress bar component */
const MiniScoreBar = ({ label, value, colorClass }) => (
  <div className="cp-mini-score">
    <div className="cp-mini-score-header">
      <span className="cp-mini-score-label">{label}</span>
      <span className="cp-mini-score-value">{Math.round(value || 0)}%</span>
    </div>
    <div className="cp-mini-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`cp-mini-bar-fill ${colorClass}`}
        style={{ width: `${Math.min(value || 0, 100)}%` }}
      />
    </div>
  </div>
);

/** Get initials from name for fallback avatar */
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0]?.toUpperCase() || "?";
};

export const CandidateCard = ({ candidate, onViewProfile }) => {
  const aiMatch = candidate?.ai_match || {};
  const score = aiMatch.ai_matching_score || candidate?.score || 0;
  const skills = aiMatch.skills || [];
  const interviewAttempts = candidate?.interview_attempts || [];

  return (
    <article
      className="cp-candidate-card"
      onClick={() => onViewProfile?.(candidate.candidate_id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewProfile?.(candidate.candidate_id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${candidate.candidate_name || "Unknown"}`}
    >
      {/* Top: Avatar + Info + Score Ring */}
      <div className="cp-card-top">
        <div className="cp-avatar-wrapper">
          {candidate.profile_photo_url ? (
            <img
              className="cp-avatar"
              src={candidate.profile_photo_url}
              alt={`${candidate.candidate_name || "Candidate"}'s photo`}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="cp-avatar-fallback"
            style={{ display: candidate.profile_photo_url ? "none" : "flex" }}
            aria-hidden="true"
          >
            {getInitials(candidate.candidate_name)}
          </div>
        </div>

        <div className="cp-card-info">
          <h3 className="cp-candidate-name">
            {candidate.candidate_name || "Unknown Candidate"}
          </h3>
          <p className="cp-candidate-role">
            <i className="bi bi-person-badge" aria-hidden="true" />
            {aiMatch.role_applied || "—"}
          </p>
        </div>

        <ScoreRing score={score} />
      </div>

      {/* Score Bars */}
      <div className="cp-scores-row">
        <MiniScoreBar
          label="Role Match"
          value={aiMatch.role_match_score}
          colorClass="cp-mini-bar-fill--blue"
        />
        <MiniScoreBar
          label="Skills Match"
          value={aiMatch.skills_match_score}
          colorClass="cp-mini-bar-fill--purple"
        />
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="cp-card-skills">
          {skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="cp-skill-tag">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="cp-skill-tag cp-skill-tag--extra">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Rationale */}
      {aiMatch.rationale && (
        <p className="cp-rationale" title={aiMatch.rationale}>
          {aiMatch.rationale}
        </p>
      )}

      {/* Bottom: Experience + Interviews + View Button */}
      <div className="cp-card-bottom">
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {aiMatch.years_experience != null && (
            <span className="cp-card-meta-item">
              <i className="bi bi-calendar3" aria-hidden="true" />
              {aiMatch.years_experience} {aiMatch.years_experience === 1 ? "yr" : "yrs"} exp
            </span>
          )}
          {interviewAttempts.length > 0 && (
            <span className="cp-card-meta-item">
              <i className="bi bi-camera-video" aria-hidden="true" />
              {interviewAttempts.length} {interviewAttempts.length === 1 ? "interview" : "interviews"}
            </span>
          )}
        </div>

        <button
          className="cp-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile?.(candidate.candidate_id);
          }}
          type="button"
          aria-label={`View ${candidate.candidate_name || "candidate"}'s profile`}
        >
          View <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
