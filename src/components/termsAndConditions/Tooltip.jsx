import React from "react";

export const Tooltip = ({ children, text }) => (
  <span className="tc-tooltip">
    {children}
    <span className="tc-tooltip-text">{text}</span>
  </span>
);
