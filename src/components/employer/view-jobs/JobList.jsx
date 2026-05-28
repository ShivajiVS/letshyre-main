import React from 'react';
import { JobCard } from './JobCard';

export const JobList = ({ jobs, onView }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="ho-empty">
        <i className="bi bi-folder-x" style={{ fontSize: "40px", color: "#94a3b8", display: "block", marginBottom: "15px" }}></i>
        No jobs found for the selected filters.
      </div>
    );
  }
  return (
    <div className="cd-job-list">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onView={onView}
        />
      ))}
    </div>
  );
};
