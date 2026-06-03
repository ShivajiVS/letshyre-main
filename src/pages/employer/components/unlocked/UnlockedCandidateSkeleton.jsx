import React from "react";

export const UnlockedCandidateSkeleton = () => {
  return (
    <article className="uc-card uc-skeleton">
      <div className="uc-card-header">
        <div className="uc-avatar-skeleton skeleton-pulse"></div>
        <div className="uc-info-skeleton">
          <div className="skeleton-line title skeleton-pulse"></div>
          <div className="skeleton-line subtitle skeleton-pulse"></div>
        </div>
        <div className="uc-score-skeleton skeleton-pulse"></div>
      </div>
      
      <div className="uc-card-body">
        <div className="uc-contact-info">
          <div className="skeleton-line text skeleton-pulse" style={{ width: "80%" }}></div>
          <div className="skeleton-line text skeleton-pulse" style={{ width: "60%" }}></div>
        </div>
        
        <div className="uc-meta-grid">
          <div className="skeleton-line text skeleton-pulse"></div>
          <div className="skeleton-line text skeleton-pulse"></div>
        </div>
        
        <div className="uc-ctc-box">
          <div className="skeleton-line box skeleton-pulse"></div>
          <div className="skeleton-line box skeleton-pulse"></div>
        </div>
      </div>
      
      <div className="uc-card-footer">
        <div className="skeleton-button skeleton-pulse"></div>
        <div className="skeleton-icon-btn skeleton-pulse"></div>
      </div>
    </article>
  );
};
