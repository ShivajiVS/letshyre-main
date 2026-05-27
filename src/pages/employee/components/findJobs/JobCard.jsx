/**
 * Formats employment_type from snake_case to Title Case.
 * e.g. "full_time" → "Full Time"
 */
const formatEmploymentType = (type) => {
  if (!type) return "N/A";
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
 * Formats a date string into a relative "X days ago" label.
 */
const formatDaysAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor(
    (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
};

export default function JobCard({ job, onViewDetails }) {
  const companyName = job?.company_name || job?.employer || "Company";
  const isApplied = !!job?.status;

  return (
    <div className="fj-job-card" onClick={() => onViewDetails(job)}>
      <img
        className="fj-job-logo"
        src={getLogoUrl(job)}
        alt={companyName}
        onError={(e) => {
          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(companyName)}`;
        }}
      />

      <div className="fj-job-body">
        {/* TOP ROW */}
        <div className="fj-job-top">
          <div>
            <h3 className="fj-job-title">{job?.title || "Untitled"}</h3>
            <p className="fj-job-company">{companyName}</p>
          </div>

          <div className="fj-job-actions">
            {isApplied && (
              <span className="fj-status-badge applied">{job.status}</span>
            )}
            <button
              className="fj-view-btn"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(job);
              }}
            >
              {isApplied ? "View" : "View Details"}
            </button>
          </div>
        </div>

        {/* META TAGS */}
        <div className="fj-job-meta">
          {job?.location && (
            <span className="fj-meta-tag">
              <i className="bi bi-geo-alt"></i>
              {job.location}
            </span>
          )}
          {job?.experience_required && (
            <span className="fj-meta-tag">
              <i className="bi bi-briefcase"></i>
              {job.experience_required} yrs
            </span>
          )}
          {job?.salary_range && (
            <span className="fj-meta-tag">
              <i className="bi bi-currency-rupee"></i>
              {job.salary_range} LPA
            </span>
          )}
          {job?.employment_type && (
            <span className="fj-meta-tag">
              <i className="bi bi-clock"></i>
              {formatEmploymentType(job.employment_type)}
            </span>
          )}
          {job?.industry_type && (
            <span className="fj-meta-tag">
              <i className="bi bi-building"></i>
              {job.industry_type}
            </span>
          )}
        </div>

        {/* SKILLS */}
        {Array.isArray(job?.skills_required) &&
          job.skills_required.length > 0 && (
            <div className="fj-job-skills">
              {job.skills_required.join(" · ")}
            </div>
          )}

        {/* POSTED DATE */}
        {job?.created_at && (
          <span className="fj-job-date">
            Posted {formatDaysAgo(job.created_at)}
          </span>
        )}
      </div>
    </div>
  );
}
