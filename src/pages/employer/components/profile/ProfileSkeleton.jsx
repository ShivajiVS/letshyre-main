import React from "react";
import "../../styles/employer-profile.css";

export const ProfileSkeleton = () => {
  return (
    <div className="ep-skeleton-container" aria-hidden="true">
      {/* Banner Skeleton */}
      <div className="ep-skeleton ep-skeleton-banner"></div>

      {/* Primary Details Skeleton */}
      <div className="ep-skeleton-card">
        <div className="ep-skeleton ep-skeleton-title"></div>
        <div className="ep-skeleton-grid">
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
        </div>
      </div>

      {/* Company Details Skeleton */}
      <div className="ep-skeleton-card">
        <div className="ep-skeleton ep-skeleton-title"></div>
        <div className="ep-skeleton-grid">
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
        </div>
      </div>
      
      {/* Documents Skeleton */}
      <div className="ep-skeleton-card">
        <div className="ep-skeleton ep-skeleton-title"></div>
        <div className="ep-skeleton-grid">
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
          <div className="ep-skeleton ep-skeleton-item"></div>
        </div>
      </div>
    </div>
  );
};
