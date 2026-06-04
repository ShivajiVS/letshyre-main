/**
 * JobSelector — Horizontal scrollable job selector for Candidate Pool.
 *
 * @param {Array} jobs - List of job objects
 * @param {string|null} selectedJobId - Currently selected job ID
 * @param {function} onSelectJob - Callback when a job is clicked
 * @param {boolean} isLoading - Loading state
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback for pagination
 */
import { CandidatePoolSkeleton } from "./CandidatePoolSkeleton";

/** Format employment type for display */
const formatEmploymentType = (type) => {
  if (!type) return null;
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export const JobSelector = ({
  jobs,
  selectedJobId,
  onSelectJob,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (isLoading && (!jobs || jobs.length === 0)) {
    return (
      <div className="cp-job-selector">
        <h2 className="cp-job-selector-title">
          <i className="bi bi-briefcase" aria-hidden="true" />
          Select a Job
        </h2>
        <CandidatePoolSkeleton variant="jobs" />
      </div>
    );
  }

  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="cp-job-selector">
      <h2 className="cp-job-selector-title">
        <i className="bi bi-briefcase" aria-hidden="true" />
        Select a Job to View Candidates
      </h2>

      <div
        className="cp-jobs-scroll"
        role="listbox"
        aria-label="Open jobs"
      >
        {jobs.map((job) => {
          const isActive = selectedJobId === job.id;
          return (
            <div
              key={job.id}
              className={`cp-job-card${isActive ? " cp-job-card--active" : ""}`}
              onClick={() => onSelectJob(job.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectJob(job.id);
                }
              }}
              role="option"
              aria-selected={isActive}
              tabIndex={0}
            >
              <h3 className="cp-job-card-title">{job.title}</h3>

              <div className="cp-job-card-meta">
                {job.employment_type && (
                  <span className="cp-job-badge">
                    <i className="bi bi-clock" aria-hidden="true" />
                    {formatEmploymentType(job.employment_type)}
                  </span>
                )}
                {job.experience_required && (
                  <span className="cp-job-badge">
                    <i className="bi bi-graph-up" aria-hidden="true" />
                    {job.experience_required}
                  </span>
                )}
                {job.salary_range && (
                  <span className="cp-job-badge">
                    <i className="bi bi-cash-stack" aria-hidden="true" />
                    {job.salary_range}
                  </span>
                )}
              </div>

              {job.skills_required && job.skills_required.length > 0 && (
                <div className="cp-job-skills-row">
                  {job.skills_required.slice(0, 3).map((skill, i) => (
                    <span key={i} className="cp-job-skill-tag">
                      {skill}
                    </span>
                  ))}
                  {job.skills_required.length > 3 && (
                    <span className="cp-job-skill-tag">
                      +{job.skills_required.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="cp-job-pagination">
          <button
            className="cp-job-page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page of jobs"
            type="button"
          >
            <i className="bi bi-chevron-left" aria-hidden="true" /> Prev
          </button>
          <span className="cp-job-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="cp-job-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page of jobs"
            type="button"
          >
            Next <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
