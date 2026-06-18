import { useState } from "react";
import { useCandidateApplications } from "@/hooks/useCandidateApplications";

import "./styles/my-applications.css";

export function MyApplications() {
  const [activeTab, setActiveTab] = useState("Applied");
  const [selectedJob, setSelectedJob] = useState(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCandidateApplications(activeTab);

  const jobs = data?.pages.flatMap((page) => page.results) || [];

  const getLogo = (job) => {
    const logo =
      job?.employer?.kyc?.company_logo ||
      job?.employer?.company_logo ||
      job?.company_logo;

    if (!logo)
      return (
        "https://api.dicebear.com/7.x/initials/svg?seed=" +
        encodeURIComponent(getCompanyName(job))
      );
    if (logo.startsWith("http")) return logo;
    return `http://127.0.0.1:8000/media/${logo}`;
  };

  const getCompanyName = (job) => {
    return job?.employer?.company_name || job?.company_name || "Company";
  };

  const formatDays = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor(
      (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  };

  return (
    <div className="ma-wrapper">
      {/* HEADER */}
      <div className="ma-welcome">
        <h3>My Applications</h3>
        <p>Track your applied, shortlisted, selected & rejected jobs</p>
      </div>

      {/* TABS */}
      <div className="ma-job-tabs">
        {["Applied", "Shortlisted", "Selected", "Rejected"].map((tab) => (
          <button
            key={tab}
            className={`ma-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* JOB LIST */}
      <div className="ma-job-list">
        {isLoading ? (
          <>
            <div className="ma-sk-card" />
            <div className="ma-sk-card" />
            <div className="ma-sk-card" />
          </>
        ) : isError ? (
          <div className="ma-empty">Failed to load applications.</div>
        ) : jobs.length === 0 ? (
          <div className="ma-empty">
            No {activeTab.toLowerCase()} applications found.
          </div>
        ) : (
          <>
            {jobs.map((job) => (
              <div key={job.id} className="ma-job-card">
                <img src={getLogo(job)} className="ma-job-logo" alt="" />

                <div className="ma-job-content">
                  <div className="ma-job-header">
                    <div>
                      <h3 className="ma-job-title">{job.title || "N/A"}</h3>
                      <p className="ma-job-company">{getCompanyName(job)}</p>
                    </div>

                    <div className="ma-job-actions">
                      <span className={`ma-badge ${job.status || "Applied"}`}>
                        {job.status || "Applied"}
                      </span>
                      <button
                        className="ma-job-open-btn"
                        onClick={() => setSelectedJob(job)}
                      >
                        Open
                      </button>
                    </div>
                  </div>

                  <div className="ma-job-meta">
                    <span>
                      {job.experience_required
                        ? `${job.experience_required} Years`
                        : "N/A"}
                    </span>
                    <span>₹ {job.salary_range || "Not disclosed"}</span>
                    <span>{job.location || "N/A"}</span>
                    <span>{job.employment_type || "Full Time"}</span>
                  </div>

                  <div className="ma-job-skills">
                    {Array.isArray(job.skills_required) &&
                    job.skills_required.length > 0
                      ? job.skills_required.join(" · ")
                      : "No specific skills mentioned"}
                  </div>

                  <span className="ma-job-date">
                    {formatDays(job.created_at)}
                  </span>
                </div>
              </div>
            ))}

            {hasNextPage && (
              <button
                className="ma-load-more"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </button>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {selectedJob && (
        <div className="ma-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="ma-modal-card" onClick={(e) => e.stopPropagation()}>
            <span
              className="ma-modal-close"
              onClick={() => setSelectedJob(null)}
            >
              ×
            </span>

            <div className="ma-modal-header">
              <img src={getLogo(selectedJob)} alt="" />
              <div>
                <h3>{selectedJob.title || "N/A"}</h3>
                <p>{getCompanyName(selectedJob)}</p>
              </div>
            </div>

            <div className="ma-modal-meta">
              <span>
                {selectedJob.experience_required
                  ? `${selectedJob.experience_required} Years`
                  : "N/A"}
              </span>
              <span>₹ {selectedJob.salary_range || "Not disclosed"}</span>
              <span>{selectedJob.location || "N/A"}</span>
              <span>{selectedJob.employment_type || "Full Time"}</span>
              <span>{selectedJob.industry_type || "N/A"}</span>
            </div>

            <div className="ma-section">
              <h4>Skills Required</h4>
              <div className="ma-skills-tags">
                {Array.isArray(selectedJob.skills_required) &&
                selectedJob.skills_required.length > 0 ? (
                  selectedJob.skills_required.map((s, i) => (
                    <span key={i}>{s}</span>
                  ))
                ) : (
                  <span>No specific skills mentioned</span>
                )}
              </div>
            </div>

            <div className="ma-section">
              <h4>Job Description</h4>
              <p>{selectedJob.description || "No description available"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
