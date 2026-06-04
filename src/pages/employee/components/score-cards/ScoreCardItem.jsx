import React from "react";
import { Link } from "react-router";

export function ScoreCardItem({ scorecard }) {
  const {
    id,
    candidate_role,
    overall_score,
    created_at,
    candidate_skills,
    ai_model_name,
  } = scorecard;

  // Format date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Display max 3 skills, then "+X more"
  const visibleSkills = candidate_skills?.slice(0, 3) || [];
  const remainingSkillsCount =
    (candidate_skills?.length || 0) - visibleSkills.length;

  return (
    <div className="sc-card-item">
      <div className="sc-card-top">
        <div>
          <h3 className="sc-card-role">{candidate_role || "Candidate"}</h3>
          <p className="sc-card-date">Completed on: {formattedDate}</p>
        </div>
        <div className="sc-card-score-badge">
          Score: {overall_score?.toFixed(1) || "0.0"}
        </div>
      </div>

      <div className="sc-card-skills">
        {visibleSkills.map((skill, index) => (
          <span key={index} className="sc-card-skill-tag">
            {skill}
          </span>
        ))}
        {remainingSkillsCount > 0 && (
          <span className="sc-card-skill-more">
            +{remainingSkillsCount} more
          </span>
        )}
      </div>

      <div className="sc-card-footer">
        <span className="sc-card-model">
          {ai_model_name ? `Model: ${ai_model_name}` : "AI Evaluated"}
        </span>
        {/* Redirect to detailed scorecard page with the specific ID */}
        <Link to={`/employee/scorecard?id=${id}`} className="sc-card-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}
