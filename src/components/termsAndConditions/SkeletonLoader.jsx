import React from "react";

export const SkeletonLoader = () => (
  <div className="tc-wrapper">
    <div className="tc-sidebar hide-on-print">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={`sk-nav-${i}`}
          className="tc-skeleton tc-sk-sidebar-item"
        ></div>
      ))}
    </div>
    <div className="tc-content-area">
      {[1, 2, 3].map((section) => (
        <div key={`sk-sec-${section}`} style={{ marginBottom: "3rem" }}>
          <div className="tc-skeleton tc-sk-title"></div>
          <div className="tc-skeleton tc-sk-text"></div>
          <div className="tc-skeleton tc-sk-text"></div>
          <div className="tc-skeleton tc-sk-text short"></div>
          <div className="tc-skeleton tc-sk-text shorter"></div>
        </div>
      ))}
    </div>
  </div>
);
