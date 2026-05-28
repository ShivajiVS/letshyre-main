import React from "react";

export const JobCard = ({ job, onView }) => {
  return (
    <div className="cd-job-card" key={job.id} onClick={() => onView(job.id)}>
      <div className="job-logo-wrapper">
        <img
          src={job.logo}
          className="job-logo"
          alt={`${job.company} logo`}
          onError={(e) => {
            e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
          }}
        />
      </div>
      <div className="job-content">
        <div className="job-header">
          <div>
            <h3 className="job-title">{job.title}</h3>
            <p className="job-company-meta">
              <span className="job-company-name">{job.company}</span>
              <span className="job-posted-date">
                {" "}
                • Posted{" "}
                {job.job_posted_date
                  ? new Date(job.job_posted_date).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric" },
                    )
                  : "recently"}
              </span>
            </p>
          </div>
        </div>
        <div className="job-meta">
          <span>
            <i className="bi bi-briefcase"></i>{" "}
            {job.experience_required || job.experience || "N/A"}
          </span>
          <span>
            <i className="bi bi-cash-stack"></i>{" "}
            {job.salary_range || job.salary || "N/A"}
          </span>
          <span>
            <i className="bi bi-geo-alt"></i> {job.location || "N/A"}
          </span>
          <span>
            <i className="bi bi-clock"></i>{" "}
            {job.employment_type || job.type || "N/A"}
          </span>
          <span>
            <i className="bi bi-building"></i>{" "}
            {job.industry_type || job.industry || "N/A"}
          </span>
        </div>
        <div className="job-skills">
          {(job.skills_required || []).slice(0, 5).map((skill, i) => (
            <span key={i} className="skill-pill">
              {skill}
            </span>
          ))}
          {job.skills_required?.length > 5 && (
            <span className="skill-pill extra">
              +{job.skills_required.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
