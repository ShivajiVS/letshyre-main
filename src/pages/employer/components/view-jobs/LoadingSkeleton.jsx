import React from 'react';

export const LoadingSkeleton = () => (
  <div className="ho-loading">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="job-skeleton" />
    ))}
  </div>
);
