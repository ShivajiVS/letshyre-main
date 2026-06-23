import React from "react";

export function EmptyTeamState({ onAdd }) {
  return (
    <div className="team-empty-state">
      <h3>No team members yet</h3>
      <p>Start building your team by adding recruiters and managers.</p>
    </div>
  );
}
