import React, { useState, useRef, useEffect } from "react";
import teamDefault from "@/assets/team-img01.png";

export function TeamCard({ member, onEdit, onDelete, onToggleStatus }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (e, action) => {
    e.stopPropagation();
    setDropdownOpen(false);
    action();
  };

  return (
    <div className="team-grid-card">
      <div className="team-card-menu" ref={dropdownRef}>
        <button
          className="team-card-menu-btn"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          aria-label="Options"
        >
          ⋮
        </button>

        {dropdownOpen && (
          <div className="team-card-dropdown">
            <button onClick={(e) => handleAction(e, () => onEdit(member))}>
              Edit
            </button>
            <button onClick={(e) => handleAction(e, () => onToggleStatus(member))}>
              {member.status === "Active" ? "Hold" : "Activate"}
            </button>
            <button
              className="delete-btn"
              onClick={(e) => handleAction(e, () => onDelete(member))}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <img src={teamDefault} alt={member.full_name} className="team-card-avatar" />
      <h3 className="team-card-name">{member.full_name}</h3>
      <p className="team-card-role">{member.title}</p>
      <span className={`team-card-status ${member.status}`}>
        {member.status}
      </span>
    </div>
  );
}
