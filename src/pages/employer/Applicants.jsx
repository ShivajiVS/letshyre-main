import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useApplicants } from "@/hooks/employer/useApplicants";
import "./styles/applicants.css";

const ApplicantSkeleton = () => (
  <div className="applicant-row" style={{ pointerEvents: "none" }}>
    <div className="applicant-info">
      <div className="applicant-photo-wrapper">
        <div className="skeleton-box" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
      </div>
      <div className="applicant-name-section">
        <div className="skeleton-box" style={{ width: "120px", height: "16px", marginBottom: "4px" }}></div>
        <div className="skeleton-box" style={{ width: "80px", height: "12px" }}></div>
      </div>
    </div>
    <div className="applicant-status-section">
      <div className="skeleton-box" style={{ width: "80px", height: "28px", borderRadius: "20px" }}></div>
    </div>
  </div>
);

export function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useApplicants(jobId, page);

  const responseData = data?.data || {};
  const applicants = responseData.results || [];
  const totalPages = responseData.total_pages || 1;
  const count = responseData.count || 0;

  const handleNextPage = () => {
    if (page < totalPages) setPage((old) => old + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((old) => old - 1);
  };

  if (isError) {
    return (
      <div className="applicants-page-container" style={{ textAlign: "center", paddingTop: "100px" }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: "48px", color: "#ef4444" }}></i>
        <h2>Error Loading Applicants</h2>
        <p style={{ color: "#64748b" }}>We couldn't load the candidates for this job.</p>
        <button className="btn-back" onClick={() => navigate(`/employer/view-jobs/${jobId}`)} style={{ margin: "20px auto" }}>
          <i className="bi bi-arrow-left"></i> Back to Job Details
        </button>
      </div>
    );
  }

  return (
    <div className="applicants-page-container">
      <button className="btn-back" onClick={() => navigate(`/employer/view-jobs/${jobId}`)}>
        <i className="bi bi-arrow-left"></i> Back to Job Details
      </button>

      <div className="applicants-header">
        <div>
          <h1>Job Applicants</h1>
          <p>Review and manage candidates who applied for this role.</p>
        </div>
        {!isLoading && (
          <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "16px" }}>
            Total Applicants: <span style={{ color: "#2563eb" }}>{count}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="applicants-list">
          {[...Array(5)].map((_, i) => (
            <ApplicantSkeleton key={i} />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <div className="applicants-empty">
          <i className="bi bi-people applicants-empty-icon"></i>
          <h3>No Applicants Yet</h3>
          <p>When candidates apply for this job, their profiles will appear here for you to review.</p>
        </div>
      ) : (
        <>
          <div className="applicants-list" style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
            {applicants.map((app) => (
              <div className="applicant-row" key={app.id}>
                <div className="applicant-info">
                  <div className="applicant-photo-wrapper">
                    {app.profile_photo ? (
                      <img src={app.profile_photo} alt={app.name} className="applicant-photo" />
                    ) : (
                      <div className="applicant-placeholder-photo">
                        {app.name ? app.name.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}
                  </div>
                  
                  <div className="applicant-name-section">
                    <h3 className="applicant-name">{app.name}</h3>
                    <p className="applicant-date">
                      Applied on {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="applicant-status-section">
                  <span className={`applicant-status ${(app.status || "applied").toLowerCase()}`}>
                    {app.status || "Applied"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="btn-page" 
                onClick={handlePrevPage} 
                disabled={page === 1 || isFetching}
              >
                <i className="bi bi-chevron-left"></i> Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button 
                className="btn-page" 
                onClick={handleNextPage} 
                disabled={page === totalPages || isFetching}
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
