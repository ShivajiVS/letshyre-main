// ViewJobs component with React Query hooks, URL query params, loading skeletons, and full modals
import { useState, useEffect, useMemo } from "react";
import "./view-jobs.css";
import overlay_img from "@/assets/JD-Upload.png";
import {
  useJobs,
  useDeleteJob,
  useUpdateJob,
  usePatchJobStatus,
} from "@/hooks/useEmployerJobs";
import api from "@/services/api"; // For view job details
import { JobList } from "@/components/employer/view-jobs/JobList";
import { Pagination } from "@/components/employer/view-jobs/Pagination";
import { LoadingSkeleton } from "@/components/employer/view-jobs/LoadingSkeleton";

export function ViewJobs() {
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // URL query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const urlStatus = searchParams.get("status");
  const approvalStatus = searchParams.get("approval_status");

  // Fix #4: Memoize queryParams to prevent infinite React Query refetching
  const queryParams = useMemo(() => {
    const params = {};
    if (urlStatus) params.status = urlStatus;
    if (approvalStatus) params.approval_status = approvalStatus;
    return params;
  }, [urlStatus, approvalStatus]);

  // React Query hooks
  const { data: jobs = [], isLoading, isError } = useJobs(queryParams);
  const deleteMutation = useDeleteJob();
  const updateMutation = useUpdateJob();
  const statusMutation = usePatchJobStatus();

  // Fix #1: Tab filtering uses lowercase consistently
  const filteredJobs =
    activeTab === "all"
      ? jobs
      : jobs.filter((j) => j.status === activeTab);

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Sync tab with URL status
  useEffect(() => {
    if (urlStatus) {
      const lc = urlStatus.toLowerCase();
      const validTabs = ["open", "closed", "paused", "pending"];
      setActiveTab(validTabs.includes(lc) ? lc : "all");
    }
  }, [urlStatus]);

  // Fix #10: Escape key closes any open modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedJob(null);
        setEditingJob(null);
        setStatusModal(null);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Fix #11: Lock body scroll when any modal is open
  useEffect(() => {
    if (selectedJob || editingJob || statusModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedJob, editingJob, statusModal]);

  const handleDelete = (jobId) => {
    if (!confirm("Delete this job?")) return;
    deleteMutation.mutate(jobId, {
      onSuccess: () => {
        // Invalidate and refetch jobs – hook already does this
      },
      onError: (err) => console.error("Delete error:", err),
    });
  };

  // Fix #2: Map API fields explicitly instead of blind spread
  const mapJobToEditForm = (j) => ({
    id: j.id,
    title: j.title,
    work_type: j.work_mode || "",
    employment_type: j.employment_type || "",
    industry: j.industry_type || "",
    skills: (j.skills_required || []).join(", "),
    salary: j.salary_range || "",
    experience: j.experience_required || "",
    openings: j.number_of_openings || 1,
    country: j.country || "",
    state: j.state || "",
    city: j.city || "",
    education: j.minimum_education || "",
    specialization: j.specialization || "",
    deadline: j.deadline || "",
    application_deadline: j.application_deadline || "",
    overview: j.description || "",
    responsibilities: (j.responsibilities || []).join("\n"),
    location: j.location || "",
    jd_file_url: j.jd_file_url || null,
    minimum_education: j.minimum_education || "",
    salary_min_lpa: j.salary_min_lpa || null,
    salary_max_lpa: j.salary_max_lpa || null,
    experience_min_years: j.experience_min_years || null,
    experience_max_years: j.experience_max_years || null,
    questions: j.questions || [],
    keywords: j.keywords || [],
    job_status: j.job_status || "",
    status: j.status || "",
  });

  const handleEdit = async (job) => {
    // Fix #8: Clear previous error when opening modal
    setUpdateError(null);
    // Open modal immediately with available job data
    setEditingJob(mapJobToEditForm(job));
    // Refresh with latest details from server
    try {
      const res = await api.get(`/user/v1/employer_job_detail/${job.id}/`);
      const j = res.data?.data || res.data;
      setEditingJob((prev) => ({
        ...prev,
        ...mapJobToEditForm(j),
      }));
    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };

  const handleStatusChange = (jobId, newStatus) => {
    const formattedStatus =
      newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    statusMutation.mutate(
      { jobId, status: formattedStatus },
      {
        onSuccess: () => setStatusModal(null),
        onError: (err) => console.error("Status update failed:", err),
      },
    );
  };

  // Fix #14: Removed unnecessary async, Fix #3: Correct API field names in payload
  const handleUpdate = () => {
    if (!editingJob) return;
    // Validate deadline format (YYYY-MM-DD) if provided
    if (
      editingJob.deadline &&
      !/^\d{4}-\d{2}-\d{2}$/.test(editingJob.deadline)
    ) {
      setUpdateError("Deadline must be in YYYY-MM-DD format.");
      return;
    }
    // Clear any previous error
    setUpdateError(null);

    // Build payload with correct API field names
    const payload = {
      title: editingJob.title,
      work_mode: editingJob.work_type,
      employment_type: editingJob.employment_type,
      industry_type: editingJob.industry,
      skills_required: editingJob.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      salary_range: editingJob.salary,
      experience_required: editingJob.experience,
      number_of_openings: editingJob.openings,
      country: editingJob.country,
      state: editingJob.state,
      city: editingJob.city,
      minimum_education: editingJob.education,
      specialization: editingJob.specialization,
      deadline: editingJob.deadline || null,
      description: editingJob.overview,
      responsibilities: editingJob.responsibilities
        .split("\n")
        .filter(Boolean),
      location: editingJob.location,
      jd_file_url: editingJob.jd_file_url,
      minimum_education: editingJob.minimum_education,
      salary_min_lpa: editingJob.salary_min_lpa,
      salary_max_lpa: editingJob.salary_max_lpa,
      experience_min_years: editingJob.experience_min_years,
      experience_max_years: editingJob.experience_max_years,
      questions: editingJob.questions,
      keywords: editingJob.keywords,
      application_deadline: editingJob.application_deadline,
      ...(editingJob.job_status && { job_status: editingJob.job_status }),
      ...(editingJob.status && { status: editingJob.status }),
    };
    updateMutation.mutate(
      { jobId: editingJob.id, payload },
      {
        onSuccess: () => setEditingJob(null),
        onError: (err) => console.error("Update error:", err),
      },
    );
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="ho-error">
        Failed to load jobs. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="ho-header">
        <h1>All Jobs</h1>
      </div>
      {/* Fix #1: All tabs are lowercase, Fix #5: Reset page on tab switch */}
      <div className="cd-job-tabs">
        {["all", "open", "closed", "paused", "pending"].map((tab) => (
          <button
            key={tab}
            className={`cd-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      {/* Fix #12: Removed duplicate "No jobs found" – JobList already handles it */}
      <div className="cd-job-list">
        <JobList
          jobs={currentJobs}
          onView={setSelectedJob}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatus={(job) => job.isApproved && setStatusModal(job)}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* ================= VIEW JOB MODAL ================= */}
      {selectedJob && (
        <div className="job-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="job-modal-card" onClick={(e) => e.stopPropagation()}>
            <span
              className="job-modal-close"
              onClick={() => setSelectedJob(null)}
            >
              ×
            </span>
            <div className="job-modal-header">
              {/* Fix #15: Added alt attribute */}
              <img
                className="job-logo"
                src={selectedJob.logo}
                alt={`${selectedJob.company} logo`}
              />
              <div>
                <h3>{selectedJob.title}</h3>
                <p>{selectedJob.company}</p>
              </div>
            </div>
            <div className="job-modal-meta">
              <span>{selectedJob.experience}</span>
              <span>{selectedJob.salary}</span>
              <span>{selectedJob.location}</span>
              <span>{selectedJob.type}</span>
              <span>{selectedJob.industry}</span>
            </div>
            <p className="job-modal-description">{selectedJob.skills}</p>
            <div className="job-modal-description">
              <h4>
                <b>Job Description</b>
              </h4>
              <p>{selectedJob.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT JOB MODAL ================= */}
      {editingJob && (
        <div className="jd-overlay" onClick={() => setEditingJob(null)}>
          <div className="jd-card-main" onClick={(e) => e.stopPropagation()}>
            <h2 className="jd-heading">Edit Job</h2>
            <div className="jd-card">
              <div className="jd-left">
                <img className="jd-upload-img" src={overlay_img} alt="" />
                <h4>Update Job Details</h4>
                <p>Modify your job listing details below.</p>
              </div>
              <div className="jd-right">
                <h3 className="jd-title">Edit Your Listing</h3>
                <div className="jd-row-3">
                  <div className="jd-field">
                    <label>Job Title</label>
                    <input value={editingJob.title} disabled />
                  </div>
                  <div className="jd-field">
                    <label>Work Type</label>
                    <input value={editingJob.work_type} disabled />
                  </div>
                  <div className="jd-field">
                    <label>Employment Type</label>
                    <input value={editingJob.employment_type} disabled />
                  </div>
                </div>
                <div className="jd-box">
                  <label>Industry</label>
                  <input value={editingJob.industry} disabled />
                </div>
                {/* Fix #7: All onChange handlers use functional updater */}
                <div className="jd-box">
                  <label>Must-Have Skills (comma separated)</label>
                  <input
                    value={editingJob.skills}
                    onChange={(e) =>
                      setEditingJob((prev) => ({ ...prev, skills: e.target.value }))
                    }
                  />
                </div>
                <div className="jd-row-3">
                  <div className="jd-field">
                    <label>Salary Range</label>
                    <input
                      value={editingJob.salary}
                      onChange={(e) =>
                        setEditingJob((prev) => ({ ...prev, salary: e.target.value }))
                      }
                    />
                  </div>
                  <div className="jd-field">
                    <label>Experience Required</label>
                    <input
                      value={editingJob.experience}
                      onChange={(e) =>
                        setEditingJob((prev) => ({
                          ...prev,
                          experience: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="jd-field">
                    <label>Openings</label>
                    <input
                      type="number"
                      value={editingJob.openings}
                      onChange={(e) =>
                        setEditingJob((prev) => ({
                          ...prev,
                          openings: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="jd-row-3">
                  <div className="jd-field">
                    <label>Country</label>
                    <input
                      value={editingJob.country}
                      onChange={(e) =>
                        setEditingJob((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="jd-field">
                    <label>State</label>
                    <input
                      value={editingJob.state}
                      onChange={(e) =>
                        setEditingJob((prev) => ({ ...prev, state: e.target.value }))
                      }
                    />
                  </div>
                  <div className="jd-field">
                    <label>City</label>
                    <input
                      value={editingJob.city}
                      onChange={(e) =>
                        setEditingJob((prev) => ({ ...prev, city: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="jd-row-3">
                  <div className="jd-field">
                    <label>Minimum Education</label>
                    <input
                      value={editingJob.education}
                      onChange={(e) =>
                        setEditingJob((prev) => ({
                          ...prev,
                          education: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="jd-field">
                    <label>Specialization</label>
                    <input
                      value={editingJob.specialization}
                      onChange={(e) =>
                        setEditingJob((prev) => ({
                          ...prev,
                          specialization: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="jd-field">
                    <label>Application Deadline</label>
                    <input
                      type="date"
                      value={editingJob.application_deadline || ""}
                      onChange={(e) =>
                        setEditingJob((prev) => ({
                          ...prev,
                          application_deadline: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="jd-box">
                  <label>Job Overview</label>
                  <textarea
                    rows={4}
                    value={editingJob.overview}
                    onChange={(e) =>
                      setEditingJob((prev) => ({ ...prev, overview: e.target.value }))
                    }
                  />
                </div>
                <div className="jd-box">
                  <label>Responsibilities</label>
                  <textarea
                    rows={5}
                    value={editingJob.responsibilities}
                    onChange={(e) =>
                      setEditingJob((prev) => ({
                        ...prev,
                        responsibilities: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="jd-actions">
                  <button
                    className="jd-back-btn"
                    onClick={() => setEditingJob(null)}
                  >
                    Cancel
                  </button>
                  {/* Fix #9: Disabled state + loading text on Update button */}
                  <button
                    className="jd-post-btn"
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Updating..." : "Update Job"}
                  </button>
                </div>
                {updateError && (
                  <p
                    className="error-msg"
                    style={{ color: "red", marginTop: "10px" }}
                  >
                    {updateError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STATUS MODAL ================= */}
      {statusModal && (
        <div className="jd-overlay" onClick={() => setStatusModal(null)}>
          <div
            className="jd-card-main"
            style={{ maxWidth: "400px", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="jd-heading">Change Job Status</h2>
            {!statusModal.isApproved ? (
              <p style={{ marginTop: "20px", color: "red" }}>
                Job is pending admin approval. Cannot change status.
              </p>
            ) : (
              <>
                <h3 style={{ marginTop: "15px" }}>{statusModal.title}</h3>
                <div
                  className="jd-actions"
                  style={{ justifyContent: "center", marginTop: "20px" }}
                >
                  {/* Fix #9: Disabled state on status buttons */}
                  <button
                    className="jd-post-btn"
                    onClick={() => handleStatusChange(statusModal.id, "Open")}
                    disabled={statusMutation.isPending}
                  >
                    Open
                  </button>
                  <button
                    className="jd-back-btn"
                    onClick={() => handleStatusChange(statusModal.id, "Paused")}
                    disabled={statusMutation.isPending}
                  >
                    Pause
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleStatusChange(statusModal.id, "Closed")}
                    disabled={statusMutation.isPending}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
            <button
              className="jd-back-btn"
              style={{ marginTop: "20px" }}
              onClick={() => setStatusModal(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
