import { useState } from "react";
import { useCandidateApplications } from "@/hooks/useCandidateApplications";

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

  /* ================= HELPERS ================= */
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
      {/* ================= STYLE ================= */}
      <style>{`

/* ===== WRAPPER ===== */
.ma-wrapper {
  min-height: calc(100vh - 180px);
}

/* ===== WELCOME & TABS ===== */
.ma-welcome {
  // background: #fff;
  padding: 30px 10px;
  border-radius: 26px;
  box-shadow: 0 10px 35px rgba(0,0,0,.04);
  margin-bottom: 24px;
}

.ma-welcome h3 {
  font-size: 22px;
  margin-bottom: 6px;
}

.ma-welcome p {
  color: #666;
  font-size: 14px;
}

.ma-job-tabs {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
  background: #fff;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 8px 28px rgba(0,0,0,.04);
  overflow-x: auto;
}

.ma-tab {
  padding: 10px 20px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-radius: 14px;
  transition: 0.25s;
  white-space: nowrap;
}

.ma-tab.active {
  background: linear-gradient(135deg, #6f9fff, #4d7eff);
  color: #fff;
  box-shadow: 0 8px 22px rgba(77, 126, 255, 0.25);
}

.ma-tab:hover:not(.active) {
  background: #f1f5f9;
}

/* ===== JOB LIST & CARD (Matches FindJobs) ===== */
.ma-job-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ma-job-card {
  display: flex;
  gap: 22px;
  background: #fff;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid #eef2f6;
  box-shadow: 0 10px 30px rgba(0,0,0,.03);
  transition: 0.3s;
}

.ma-job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,.06);
  border-color: #dbe4f0;
}

.ma-job-logo {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  border: 3px solid #f1f5f9;
  object-fit: cover;
}

.ma-job-content {
  flex: 1;
}

.ma-job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ma-job-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.ma-job-company {
  font-size: 14px;
  color: #64748b;
}

.ma-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 10px;
}
.ma-badge.Applied { background: #e0ecff; color: #2563eb; }
.ma-badge.Shortlisted { background: #fff3cd; color: #d97706; }
.ma-badge.Selected { background: #dcfce7; color: #16a34a; }
.ma-badge.Rejected { background: #ffe4e6; color: #dc2626; }

.ma-job-open-btn {
  background: #f1f5f9;
  color: #334155;
  border: none;
  padding: 8px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.ma-job-open-btn:hover {
  background: #e2e8f0;
}

.ma-job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.ma-job-meta span {
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  border: 1px solid #f1f5f9;
}

.ma-job-skills {
  margin-top: 14px;
  font-size: 12px;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ma-job-date {
  display: block;
  margin-top: 14px;
  font-size: 11px;
  color: #94a3b8;
}

.ma-load-more {
  display: block;
  margin: 30px auto;
  padding: 10px 26px;
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.ma-load-more:hover:not(:disabled) {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.ma-empty {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 24px;
  color: #64748b;
}

/* ===== MODAL ===== */
.ma-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.ma-modal-card {
  width: 92%;
  max-width: 700px;
  background: #fff;
  border-radius: 24px;
  padding: 30px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0,0,0,.25);
  animation: fadeIn .25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(.95); }
  to { opacity: 1; transform: scale(1); }
}

.ma-modal-close {
  position: absolute;
  right: 20px;
  top: 16px;
  font-size: 26px;
  cursor: pointer;
  color: #64748b;
}

.ma-modal-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.ma-modal-header img {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  border: 3px solid #f8fafc;
}

.ma-modal-header h3 {
  margin: 0 0 6px 0;
  font-size: 20px;
  color: #1e293b;
}

.ma-modal-header p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.ma-modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.ma-modal-meta span {
  background: #f8fafc;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
}

.ma-section {
  margin-top: 24px;
}

.ma-section h4 {
  font-size: 15px;
  color: #1e293b;
  margin-bottom: 12px;
}

.ma-section p {
  font-size: 13px;
  color: #475569;
  line-height: 1.7;
}

.ma-skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ma-skills-tags span {
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #334155;
}

/* SKELETON */
@keyframes sk-shimmer {
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}

.ma-sk-card {
  height: 160px;
  border-radius: 24px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 600px 100%;
  animation: sk-shimmer 1.4s ease-in-out infinite;
}

@media(max-width: 768px) {
  .ma-job-card { flex-direction: column; gap: 16px; padding: 18px; }
  .ma-job-header { flex-direction: column; align-items: flex-start; }
  .ma-job-open-btn { width: 100%; margin-top: 14px; }
  .ma-modal-card { padding: 20px; }
  .ma-modal-header { flex-direction: column; align-items: flex-start; }
}
      `}</style>

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

                    <div>
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
