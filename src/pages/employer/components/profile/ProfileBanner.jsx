import React from "react";
import img01 from "@/assets/emp-profile.png";
import img02 from "@/assets/emp-profile02.png";

export const ProfileBanner = ({ companyName, stats, onEditClick }) => {
  return (
    <section className="ep-banner" aria-label="Profile banner">
      <div className="ep-banner-left">
        <img
          src={img01}
          alt="Profile illustration with decorative elements"
          className="ep-banner-side-image ep-left-image"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      <div className="ep-banner-content">
        <h2 className="ep-banner-title">{companyName || "Your Company"}</h2>
        <p className="ep-banner-subtitle">
          Review and manage your organization's core details, branding, and
          contact information.
        </p>

        <button
          className="ep-edit-btn"
          aria-label="Edit profile information"
          onClick={onEditClick}
        >
          Edit Profile
        </button>

        <div className="ep-cpb-stats">
          <div className="ep-cpb-stat">
            <span className="ep-cpb-stat-num">{stats?.totalJobs || 0}</span>
            <span className="ep-cpb-stat-label">Jobs Posted</span>
          </div>
          <div className="ep-cpb-stat">
            <span className="ep-cpb-stat-num">{stats?.openJobs || 0}</span>
            <span className="ep-cpb-stat-label">Active Jobs</span>
          </div>
          <div className="ep-cpb-stat">
            <span className="ep-cpb-stat-num">0</span>
            <span className="ep-cpb-stat-label">Matches</span>
          </div>
          <div className="ep-cpb-stat">
            <span className="ep-cpb-stat-num">0</span>
            <span className="ep-cpb-stat-label">Already Hired</span>
          </div>
        </div>
      </div>

      <div className="ep-banner-right">
        <img
          src={img02}
          alt="Decorative polygon shape"
          className="ep-banner-side-image ep-right-image"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    </section>
  );
};
