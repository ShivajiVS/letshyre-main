import React from "react";

export function ScoreCardsSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="sc-skeleton-item">
          <div className="sc-card-top" style={{ marginBottom: "20px" }}>
            <div style={{ width: "70%" }}>
              <div className="sc-skeleton-pulse sc-skeleton-title"></div>
              <div className="sc-skeleton-pulse sc-skeleton-date"></div>
            </div>
            <div
              className="sc-skeleton-pulse"
              style={{ width: "60px", height: "30px", borderRadius: "12px" }}
            ></div>
          </div>

          <div className="sc-skeleton-tags">
            <div className="sc-skeleton-pulse sc-skeleton-tag"></div>
            <div className="sc-skeleton-pulse sc-skeleton-tag"></div>
            <div className="sc-skeleton-pulse sc-skeleton-tag"></div>
          </div>

          <div className="sc-skeleton-pulse sc-skeleton-footer"></div>
        </div>
      ))}
    </>
  );
}
