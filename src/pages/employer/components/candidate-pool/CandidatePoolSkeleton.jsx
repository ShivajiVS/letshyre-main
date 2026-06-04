/**
 * CandidatePoolSkeleton — Loading skeletons for the Candidate Pool page.
 *
 * @param {"stats"|"jobs"|"candidates"} variant - Which section to show skeleton for
 */
export const CandidatePoolSkeleton = ({ variant }) => {
  if (variant === "stats") {
    return (
      <div className="cp-stats-skeleton" aria-busy="true" aria-label="Loading statistics">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="cp-skeleton cp-stat-skeleton-card" />
        ))}
      </div>
    );
  }

  if (variant === "jobs") {
    return (
      <div className="cp-jobs-skeleton" aria-busy="true" aria-label="Loading jobs">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="cp-skeleton cp-job-skeleton-card" />
        ))}
      </div>
    );
  }

  if (variant === "candidates") {
    return (
      <div className="cp-candidates-skeleton" aria-busy="true" aria-label="Loading candidates">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="cp-skeleton cp-candidate-skeleton-card" />
        ))}
      </div>
    );
  }

  return null;
};
