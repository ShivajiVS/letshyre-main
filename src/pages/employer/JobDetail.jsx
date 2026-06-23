import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useJobDetail,
  useDeleteJob,
  usePatchJobStatus,
} from "@/hooks/employer/useEmployerJobs";
import { EditJobModal } from "@pages/employer/components/view-jobs/EditJobModal";
import "./styles/job-detail.css";

const JobDetailSkeleton = () => (
  <div className="job-detail-container">
    <div className="jd-header-section">
      <div className="jd-header-left">
        <div className="jd-header-info">
          <div
            className="skeleton-box"
            style={{ width: "200px", height: "24px", marginBottom: "8px" }}
          ></div>
          <div
            className="skeleton-box"
            style={{ width: "150px", height: "16px" }}
          ></div>
        </div>
      </div>
    </div>
    <div className="jd-content-grid">
      <div className="jd-main-card">
        <div
          className="skeleton-box"
          style={{ width: "30%", height: "20px", marginBottom: "20px" }}
        ></div>
        <div
          className="skeleton-box"
          style={{ width: "100%", height: "12px", marginBottom: "8px" }}
        ></div>
        <div
          className="skeleton-box"
          style={{ width: "100%", height: "12px", marginBottom: "8px" }}
        ></div>
        <div
          className="skeleton-box"
          style={{ width: "80%", height: "12px" }}
        ></div>
      </div>
      <div className="jd-sidebar-card">
        <div
          className="skeleton-box"
          style={{ width: "50%", height: "20px", marginBottom: "20px" }}
        ></div>
        <div
          className="skeleton-box"
          style={{ width: "100%", height: "40px", marginBottom: "16px" }}
        ></div>
        <div
          className="skeleton-box"
          style={{ width: "100%", height: "40px" }}
        ></div>
      </div>
    </div>
  </div>
);

export function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading, isError } = useJobDetail(jobId);
  const deleteMutation = useDeleteJob();
  const statusMutation = usePatchJobStatus();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isLoading) return <JobDetailSkeleton />;

  if (isError || !job) {
    return (
      <div
        className="job-detail-container"
        style={{ textAlign: "center", paddingTop: "100px" }}
      >
        <i
          className="bi bi-exclamation-triangle"
          style={{ fontSize: "48px", color: "#ef4444" }}
        ></i>
        <h2>Job Not Found</h2>
        <p style={{ color: "#64748b" }}>
          The job you are looking for does not exist or an error occurred.
        </p>
        <button
          className="btn btn-edit"
          onClick={() => navigate("/employer/view-jobs")}
          style={{ margin: "20px auto", display: "inline-flex" }}
        >
          <i className="bi bi-arrow-left"></i> Back to Jobs
        </button>
      </div>
    );
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const formattedStatus =
      newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    statusMutation.mutate({ jobId: job.id, status: formattedStatus });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(job.id, {
      onSuccess: () => navigate("/employer/view-jobs"),
    });
  };

  return (
    <div className="job-detail-container">
      <button
        className="jd-back-nav"
        onClick={() => navigate("/employer/view-jobs")}
      >
        <i className="bi bi-arrow-left"></i> Back to Jobs
      </button>

      {/* Header Section */}
      <div className="jd-header-section">
        <div className="jd-header-left">
          <div className="jd-header-info">
            <h1>{job.title}</h1>
            <p className="jd-company-meta">
              <span>
                Posted{" "}
                {job.job_posted_date
                  ? new Date(job.job_posted_date).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric" },
                    )
                  : "recently"}
              </span>
            </p>
          </div>
        </div>
        <div className="jd-header-actions">
          <button
            className="btn btn-applicants"
            style={{ backgroundColor: "#2563eb", color: "#fff", borderColor: "#2563eb" }}
            onClick={() => navigate(`/employer/view-jobs/applicants/${jobId}`)}
          >
            <i className="bi bi-people"></i> View Applicants
          </button>
          <button
            className="btn btn-edit"
            onClick={() => setIsEditModalOpen(true)}
          >
            <i className="bi bi-pencil"></i> Edit
          </button>
          <button
            className="btn btn-delete"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <i className="bi bi-trash3"></i> Delete
          </button>
          <select
            className={`btn status-select status-${(job.status || "open").toLowerCase()}`}
            value={(job.status || "open").toLowerCase()}
            onChange={handleStatusChange}
            disabled={statusMutation.isPending}
          >
            <option value="open">Open</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="jd-content-grid">
        {/* Main Content */}
        <div className="jd-main-card">
          <div className="jd-section">
            <h3 className="jd-section-title">
              <i className="bi bi-card-text"></i> Job Description
            </h3>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {job.description || "No description provided."}
            </p>
          </div>

          <div className="jd-section">
            <h3 className="jd-section-title">
              <i className="bi bi-list-check"></i> Responsibilities
            </h3>
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <ul className="jd-list">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            ) : (
              <p>No specific responsibilities listed.</p>
            )}
          </div>

          <div className="jd-section">
            <h3 className="jd-section-title">
              <i className="bi bi-star"></i> Required Skills
            </h3>
            <div className="jd-skills-container">
              {job.skills_required && job.skills_required.length > 0 ? (
                job.skills_required.map((skill, idx) => (
                  <span key={idx} className="jd-skill-pill">
                    {skill}
                  </span>
                ))
              ) : (
                <p>No skills specified.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Meta */}
        <div className="jd-sidebar-card">
          <h3 className="jd-section-title" style={{ marginBottom: "24px" }}>
            <i className="bi bi-info-circle"></i> Job Overview
          </h3>

          <div className="jd-meta-item">
            <div className="jd-meta-icon">
              <i className="bi bi-briefcase"></i>
            </div>
            <div className="jd-meta-text">
              <span className="jd-meta-label">Experience</span>
              <span className="jd-meta-value">
                {job.experience_required || job.experience || "Not specified"}
              </span>
            </div>
          </div>

          <div className="jd-meta-item">
            <div className="jd-meta-icon">
              <i className="bi bi-cash-stack"></i>
            </div>
            <div className="jd-meta-text">
              <span className="jd-meta-label">Salary</span>
              <span className="jd-meta-value">
                {job.salary_range || job.salary || "Not specified"}
              </span>
            </div>
          </div>

          <div className="jd-meta-item">
            <div className="jd-meta-icon">
              <i className="bi bi-geo-alt"></i>
            </div>
            <div className="jd-meta-text">
              <span className="jd-meta-label">Location</span>
              <span className="jd-meta-value">
                {job.location ||
                  `${job.city || ""}, ${job.country || ""}`
                    .trim()
                    .replace(/^,|,$/g, "") ||
                  "Not specified"}
              </span>
            </div>
          </div>

          <div className="jd-meta-item">
            <div className="jd-meta-icon">
              <i className="bi bi-clock"></i>
            </div>
            <div className="jd-meta-text">
              <span className="jd-meta-label">Work Mode</span>
              <span
                className="jd-meta-value"
                style={{ textTransform: "capitalize" }}
              >
                {job.work_mode
                  ? job.work_mode.replace("_", " ")
                  : "Not specified"}
              </span>
            </div>
          </div>

          <div className="jd-meta-item">
            <div className="jd-meta-icon">
              <i className="bi bi-building"></i>
            </div>
            <div className="jd-meta-text">
              <span className="jd-meta-label">Industry</span>
              <span className="jd-meta-value">
                {job.industry_type || "Not specified"}
              </span>
            </div>
          </div>

          <div
            className="jd-meta-item"
            style={{ borderBottom: "none", paddingBottom: 0 }}
          >
            <div className="jd-meta-icon">
              <i className="bi bi-people"></i>
            </div>
            <div className="jd-meta-text">
              <span className="jd-meta-label">Openings</span>
              <span className="jd-meta-value">
                {job.number_of_openings || 1}
              </span>
            </div>
          </div>

          {job.jd_file_url && (
            <div
              style={{
                marginTop: "24px",
                paddingTop: "24px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <span className="jd-meta-label">Attachments</span>
              <br />
              <a
                href={job.jd_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="jd-jd-link"
              >
                <i
                  className="bi bi-file-earmark-pdf"
                  style={{ color: "#ef4444" }}
                ></i>{" "}
                View Official JD
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <EditJobModal job={job} onClose={() => setIsEditModalOpen(false)} />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="del-modal-overlay"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div className="del-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="del-modal-icon">
              <i className="bi bi-trash3"></i>
            </div>
            <h3>Delete Job Listing?</h3>
            <p>
              This action cannot be undone. Are you sure you want to permanently
              delete this job?
            </p>
            <div className="del-modal-actions">
              <button
                className="del-cancel-btn"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                className="del-confirm-btn"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
