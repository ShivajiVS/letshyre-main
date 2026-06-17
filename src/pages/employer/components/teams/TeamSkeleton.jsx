import React from "react";

export function TeamSkeleton() {
  return (
    <div className="team-skeleton-card">
      <div className="skeleton-avatar shimmer"></div>
      <div className="skeleton-text name shimmer"></div>
      <div className="skeleton-text role shimmer"></div>
      <div className="skeleton-badge shimmer"></div>
    </div>
  );
}
