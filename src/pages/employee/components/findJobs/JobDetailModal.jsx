import { useEffect } from "react";

/**
 * Formats employment_type from snake_case to Title Case.
 */
const formatEmploymentType = (type) => {
  if (!type) return "N/A";
  return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Returns the company logo URL or a generated avatar fallback.
 */
const getLogoUrl = (job) => {
  const logo = job?.company_logo;
  if (!logo) {
    const name = job?.company_name || job?.employer || "C";
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
  }
  if (logo.startsWith("http")) return logo;
  return `${import.meta.env.VITE_API_BASE_URL}/media/${logo}`;
};

/**
 * JobDetailModal
 * Shows full job details with skills, description, and an Apply button.
 *
 * @param {{ job: Object, onClose: Function, onApply: Function, isApplying: boolean }} props
 */
export default function JobDetailModal({ job, onClose, onApply, isApplying }) {
  if (!job) return null;

  const companyName = job?.company_name || job?.employer || "Company";
  const isApplied = !!job?.status;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fj-modal-overlay" onClick={onClose}>
      <div className="fj-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button className="fj-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* HEADER */}
        <div className="fj-modal-header">
          <img
            className="fj-modal-logo"
            src={getLogoUrl(job)}
            alt={companyName}
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(companyName)}`;
            }}
          />
          <div>
            <h3 className="fj-modal-title">{job.title}</h3>
            <p className="fj-modal-company">{companyName}</p>
          </div>
        </div>

        {/* META TAGS */}
        <div className="fj-modal-meta">
          {job?.experience_required && (
            <span className="fj-modal-meta-tag">
              <i className="bi bi-briefcase"></i>
              {job.experience_required}
            </span>
          )}
          {job?.salary_range && (
            <span className="fj-modal-meta-tag">
              <i className="bi bi-currency-rupee"></i>
              {job.salary_range}
            </span>
          )}
          {job?.location && (
            <span className="fj-modal-meta-tag">
              <i className="bi bi-geo-alt"></i>
              {job.location}
            </span>
          )}
          {job?.employment_type && (
            <span className="fj-modal-meta-tag">
              <i className="bi bi-clock"></i>
              {formatEmploymentType(job.employment_type)}
            </span>
          )}
          {job?.industry_type && (
            <span className="fj-modal-meta-tag">
              <i className="bi bi-building"></i>
              {job.industry_type}
            </span>
          )}
        </div>

        {/* SKILLS */}
        {Array.isArray(job?.skills_required) &&
          job.skills_required.length > 0 && (
            <div className="fj-modal-section">
              <h4 className="fj-modal-section-title">Skills Required</h4>
              <div className="fj-modal-skills">
                {job.skills_required.map((skill, i) => (
                  <span className="fj-skill-chip" key={i}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* DESCRIPTION */}
        <div className="fj-modal-section">
          <h4 className="fj-modal-section-title">Job Description</h4>
          <p className="fj-modal-description">
            {job.description || "No description available"}
          </p>
        </div>

        {/* APPLY BUTTON */}
        <button
          className={`fj-apply-btn ${isApplied ? "applied" : ""}`}
          disabled={isApplying || isApplied}
          onClick={() => onApply(job.id)}
        >
          {isApplying
            ? "Applying..."
            : isApplied
              ? "Already Applied"
              : "Apply Now"}
        </button>
      </div>
    </div>
  );
}
