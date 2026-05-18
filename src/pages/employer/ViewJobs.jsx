import { useState, useEffect } from "react";
import api from "@/services/api";
import "./view-jobs.css";
import overlay_img from "@/assets/JD-Upload.png";

const BASE_URL = "https://api.letshyre.com";

export function ViewJobs() {
  const [editingJob, setEditingJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsToShow, setJobsToShow] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState(null);

  // ✅ PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ FETCH JOBS + KYC
  const fetchJobs = async () => {
    try {
      const res = await api.get("/user/v1/employer_jobs/");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      let kycMap = {};

      try {
        const kycRes = await api.get("/user/v1/employer_kyc/");
        let kycData = kycRes.data?.data || kycRes.data;

        if (Array.isArray(kycData)) {
          kycData.forEach((k) => {
            kycMap[k.employer] = k;
          });
        } else if (kycData && typeof kycData === "object") {
          kycMap[kycData.employer] = kycData;
        }
      } catch (err) {
        console.warn("KYC fetch failed:", err);
      }

      const mapped = data.map((j) => {
        const kyc = kycMap[j.employer] || {};

        // ✅ FIX: use correct field
        const isApproved =
          String(j.job_status).toLowerCase() === "approved";

        return {
          id: j.id,
          title: j.title || j.job_title || "Untitled Role",
          company: kyc.company_name || "Your Company",

          experience:
            j.experience ||
            j.experience_required ||
            "Not specified",

          salary:
            j.salary_range ||
            (j.min_salary && j.max_salary
              ? `${j.min_salary} - ${j.max_salary} LPA`
              : j.salary || "Not disclosed"),

          location: j.location || j.job_location || "India",

          type:
            j.employment_type ||
            j.job_type ||
            "Full Time",

          industry:
            j.industry_type || j.industry || j.category || "Software",

          skills: Array.isArray(j.must_have_skills)
            ? j.must_have_skills.join(" · ")
            : j.must_have_skills || j.skills || "",

          description: j.description || "No description available",

          logo:
            kyc.company_logo ||
            "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",

          // ✅ FINAL
          isApproved,

          status: isApproved
            ? (j.status || "open").toLowerCase()
            : "pending",
        };
      });

      setJobs(mapped);
      setJobsToShow(mapped);
      setCurrentPage(1);

    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "all") {
      setJobsToShow(jobs);
    } else {
      setJobsToShow(jobs.filter((j) => j.status === activeTab));
    }
    setCurrentPage(1);
  }, [activeTab, jobs]);

  // ✅ PAGINATION LOGIC
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobsToShow.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobsToShow.length / jobsPerPage);

  const handleDelete = async (jobId) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/user/v1/employer_job_detail/${jobId}/`);
      fetchJobs();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = async (jobId) => {
    try {
      const res = await api.get(`/user/v1/employer_job_detail/${jobId}/`);
      const j = res.data?.data || res.data;

      setEditingJob({
        id: j.id,

        // 🔒 NON EDITABLE
        title: j.title,
        work_type: j.work_mode,
        employment_type: j.employment_type,
        industry: j.industry_type,

        // ✅ EDITABLE
        skills: (j.skills_required || []).join(", "),
        salary: j.salary_range || "",
        experience: j.experience_required || "",
        openings: j.number_of_openings || 1,

        country: j.country || "",
        state: j.state || "",
        city: j.city || "",

        education: j.education_required || "",
        specialization: j.specialization || "",

        deadline: j.deadline || "",
        overview: j.description || "",
        responsibilities: (j.responsibilities || []).join("\n"),
      });

    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        salary_range: editingJob.salary,
        experience_required: editingJob.experience,
        number_of_openings: editingJob.openings,

        country: editingJob.country,
        state: editingJob.state,
        city: editingJob.city,

        education_required: editingJob.education,
        specialization: editingJob.specialization,

        deadline: editingJob.deadline,
        description: editingJob.overview,
        responsibilities: editingJob.responsibilities.split("\n"),
        skills_required: editingJob.skills.split(",").map((s) => s.trim()),
      };

      await api.patch(
        `/user/v1/employer_job_detail/${editingJob.id}/`,
        payload
      );

      setEditingJob(null);
      fetchJobs();

    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      // ✅ Convert to backend format
      const formattedStatus =
        newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

      await api.patch(`/user/v1/employer_job_detail/${jobId}/`, {
        status: formattedStatus, // ✅ IMPORTANT FIX
      });

      setStatusModal(null);
      fetchJobs();

    } catch (err) {
      console.error("Status update failed:", err.response?.data || err);
    }
  };

  if (loading) return <div className="ho-loading">Loading jobs...</div>;

  return (
    <>
      <div className="ho-header">
        <h1>All Jobs</h1>
      </div>

      <div className="cd-job-tabs">
        {["all", "Open", "Closed", "Paused", "Pending"].map((tab) => (
          <button
            key={tab}
            className={`cd-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="cd-job-list">
        {currentJobs.length === 0 && (
          <div className="ho-empty">No jobs found</div>
        )}

        {currentJobs.map((job) => (
          <div key={job.id} className="cd-job-card enhanced-card">
            <div>
              <img
                src={job.logo}
                className="job-logo"
                onError={(e) => {
                  e.target.src =
                    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
                }}
              />
            </div>

            <div className="job-content">
              <div className="job-header">
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                </div>

                <div className="job-actions">
                  <button className="btn btn-view" onClick={() => setSelectedJob(job)}>
                    View
                  </button>

                  <button className="btn btn-edit" onClick={() => handleEdit(job.id)}>
                    Edit
                  </button>

                  <button className="btn btn-delete" onClick={() => handleDelete(job.id)}>
                    Delete
                  </button>

                  <button
                    className={`btn btn-status ${
                      job.isApproved ? `status-${job.status}` : "status-pending"
                    }`}
                    onClick={() => job.isApproved && setStatusModal(job)}
                  >
                    {job.isApproved
                      ? job.status.charAt(0).toUpperCase() + job.status.slice(1)
                      : "Pending"}
                  </button>
                </div>
              </div>

              <div className="job-meta">
                <span>• {job.experience}</span>
                <span>{job.salary}</span>
                <span>📍 {job.location}</span>
                <span>{job.type}</span>
                <span>🏢 {job.industry}</span>
              </div>

              <div className="job-skills">{job.skills}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ PAGINATION */}
      <div className="pagination-container">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
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
        <img
          className="job-logo"
          src={selectedJob.logo}
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
        <h4><b>Job Description</b></h4>
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
        {/* LEFT SIDE */}
        <div className="jd-left">
          <img className="jd-upload-img" src={overlay_img} alt="" />
          <h4>Update Job Details</h4>
          <p>Modify your job listing details below.</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="jd-right">
          <h3 className="jd-title">Edit Your Listing</h3>

          {/* 🔒 NON EDITABLE */}
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

          {/* SKILLS */}
          <div className="jd-box">
            <label>Must-Have Skills (comma separated)</label>
            <input
              value={editingJob.skills}
              onChange={(e) =>
                setEditingJob({ ...editingJob, skills: e.target.value })
              }
            />
          </div>

          {/* SALARY + EXPERIENCE + OPENINGS */}
          <div className="jd-row-3">
            <div className="jd-field">
              <label>Salary Range</label>
              <input
                value={editingJob.salary}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, salary: e.target.value })
                }
              />
            </div>

            <div className="jd-field">
              <label>Experience Required</label>
              <input
                value={editingJob.experience}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, experience: e.target.value })
                }
              />
            </div>

            <div className="jd-field">
              <label>Openings</label>
              <input
                type="number"
                value={editingJob.openings}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, openings: e.target.value })
                }
              />
            </div>
          </div>

          {/* LOCATION */}
          <div className="jd-row-3">
            <div className="jd-field">
              <label>Country</label>
              <input
                value={editingJob.country}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, country: e.target.value })
                }
              />
            </div>

            <div className="jd-field">
              <label>State</label>
              <input
                value={editingJob.state}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, state: e.target.value })
                }
              />
            </div>

            <div className="jd-field">
              <label>City</label>
              <input
                value={editingJob.city}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, city: e.target.value })
                }
              />
            </div>
          </div>

          

          {/* SPECIALIZATION */}
          <div className="jd-row-3">
            <div className="jd-field">
              <label>Minimum Education</label>
              <input
                value={editingJob.education}
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    education: e.target.value,
                  })
                }
              />
            </div>
            <div className="jd-field">
              <label>Specialization</label>
              <input
                value={editingJob.specialization}
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    specialization: e.target.value,
                  })
                }
              />
            </div>
            <div className="jd-field">
              <label>Application Deadline</label>
              <input
                type="date"
                value={editingJob.deadline}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, deadline: e.target.value })
                }
              />
            </div>
          </div>

          {/* DEADLINE */}
          <div className="jd-row-3">
            
          </div>

          {/* JOB OVERVIEW */}
          <div className="jd-box">
            <label>Job Overview</label>
            <textarea
              rows={4}
              value={editingJob.overview}
              onChange={(e) =>
                setEditingJob({ ...editingJob, overview: e.target.value })
              }
            />
          </div>

          {/* RESPONSIBILITIES */}
          <div className="jd-box">
            <label>Responsibilities</label>
            <textarea
              rows={5}
              value={editingJob.responsibilities}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  responsibilities: e.target.value,
                })
              }
            />
          </div>

          {/* ACTIONS */}
          <div className="jd-actions">
            <button
              className="jd-back-btn"
              onClick={() => setEditingJob(null)}
            >
              Cancel
            </button>

            <button className="jd-post-btn" onClick={handleUpdate}>
              Update Job
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{/* ================= STATUS MODAL ================= */}
{statusModal && (
  <div
    className="jd-overlay"
    onClick={() => setStatusModal(null)}
  >
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
          <h3 style={{ marginTop: "15px" }}>
            {statusModal.title}
          </h3>

          <div
            className="jd-actions"
            style={{ justifyContent: "center", marginTop: "20px" }}
          >
            <button
              className="jd-post-btn"
              onClick={() =>
                handleStatusChange(statusModal.id, "Open")
              }
            >
              Open
            </button>

            <button
              className="jd-back-btn"
              onClick={() =>
                handleStatusChange(statusModal.id, "Paused")
              }
            >
              Pause
            </button>

            <button
              className="btn btn-delete"
              onClick={() =>
                handleStatusChange(statusModal.id, "Closed")
              }
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