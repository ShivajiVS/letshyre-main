import React from 'react';

export const JobCard = ({ job, onView, onEdit, onDelete, onStatus }) => {
  return (
    <div className="cd-job-card enhanced-card" key={job.id}>
      <div>
        <img
          src={job.logo}
          className="job-logo"
          onError={(e) => {
            e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
          }}
        />
      </div>
      <div className="job-content">
        <div className="job-header">
          <div>
            <h3 className="job-title">{job.title}</h3>
            <p className="job-company">{job.company}</p>
          </div>
          <div className="job-actions">
            <button className="btn btn-view" aria-label={`View job ${job.title}`} onClick={() => onView(job)}>
              View
            </button>
            <button className="btn btn-edit" aria-label={`Edit job ${job.title}`} onClick={() => onEdit(job)}>
              Edit
            </button>
            <button className="btn btn-delete" aria-label={`Delete job ${job.title}`} onClick={() => onDelete(job.id)}>
              Delete
            </button>
            <button
              className={`btn btn-status ${job.isApproved ? `status-${job.status}` : "status-pending"}`}
              aria-label={`Change status for job ${job.title}`}
              onClick={() => job.isApproved && onStatus(job)}
            >
              {job.isApproved ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : "Pending"}
            </button>
          </div>
        </div>
        <div className="job-meta">
          <span>• {job.experience}</span>
          <span>{job.salary}</span>
          <span>📍 {job.location}</span>
          <span>{job.type}</span>
          <span>🏢 {job.industry}</span>
        </div>
        <div className="job-skills">{job.skills}</div>
      </div>
    </div>
  );
};
