import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import teamDefault from "@/assets/team-img01.png";

export function TeamCard({ member, index, onEdit, onDelete, onToggleStatus }) {
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
    <motion.div 
      className="team-grid-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 || 0, ease: "easeOut" }}
    >
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
            <button onClick={(e) => handleAction(e, () => onDelete(member))}>
              Remove
            </button>
            <button onClick={(e) => handleAction(e, () => onToggleStatus(member))}>
              {member.status === "Active" ? "Hold" : "Activate"}
            </button>
          </div>
        )}
      </div>

      <img src={teamDefault} alt={member.full_name} className="team-card-avatar" />
      <h3 className="team-card-name">{member.full_name}</h3>
      <p className="team-card-role">{member.title}</p>
    </motion.div>
  );
}
