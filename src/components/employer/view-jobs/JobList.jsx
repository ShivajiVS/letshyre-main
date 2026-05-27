import React from 'react';
import { JobCard } from './JobCard';

export const JobList = ({ jobs, onView, onEdit, onDelete, onStatus }) => {
  if (!jobs || jobs.length === 0) {
    return <div className="ho-empty">No jobs found</div>;
  }
  return (
    <div className="cd-job-list">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatus={onStatus}
        />
      ))}
    </div>
  );
};
