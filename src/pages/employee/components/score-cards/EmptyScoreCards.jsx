import React from "react";
import { Link } from "react-router-dom";

export function EmptyScoreCards() {
  return (
    <div className="sc-empty-state">
      <div className="sc-empty-icon">
        {/* Simple SVG illustration for empty state */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="9"></line>
          <line x1="9" y1="13" x2="15" y2="13"></line>
          <line x1="9" y1="17" x2="12" y2="17"></line>
        </svg>
      </div>
      <h3 className="sc-empty-title">No Score Cards Found</h3>
      <p className="sc-empty-desc">
        It looks like you haven't completed any interviews yet, or your scorecard is still being generated.
      </p>
      <Link to="/employee/find-jobs" className="sc-empty-btn">
        Find Jobs to Apply
      </Link>
    </div>
  );
}
