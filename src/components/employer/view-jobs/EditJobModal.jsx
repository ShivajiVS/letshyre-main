import React, { useState } from "react";
import overlay_img from "@/assets/JD-Upload.png";
import { useUpdateJob } from "@/hooks/employer/useEmployerJobs";

export const EditJobModal = ({ job, onClose }) => {
  const updateMutation = useUpdateJob();
  const [updateError, setUpdateError] = useState(null);

  //  Map API fields explicitly instead of blind spread
  const [editingJob, setEditingJob] = useState({
    id: job.id,
    title: job.title,
    work_type: job.work_mode || "",
    employment_type: job.employment_type || "",
    industry: job.industry_type || "",
    skills: (job.skills_required || []).join(", "),
    salary: job.salary_range || "",
    experience: job.experience_required || "",
    openings: job.number_of_openings || 1,
    country: job.country || "",
    state: job.state || "",
    city: job.city || "",
    education: job.minimum_education || "",
    specialization: job.specialization || "",
    deadline: job.deadline || "",
    application_deadline: job.application_deadline || "",
    overview: job.description || "",
    responsibilities: (job.responsibilities || []).join("\n"),
    location: job.location || "",
    jd_file_url: job.jd_file_url || null,
    minimum_education: job.minimum_education || "",
    salary_min_lpa: job.salary_min_lpa || null,
    salary_max_lpa: job.salary_max_lpa || null,
    experience_min_years: job.experience_min_years || null,
    experience_max_years: job.experience_max_years || null,
    questions: job.questions || [],
    keywords: job.keywords || [],
    job_status: job.job_status || "",
    status: job.status || "",
  });

  const handleUpdate = () => {
    // Validate deadline format (YYYY-MM-DD) if provided
    if (
      editingJob.deadline &&
      !/^\d{4}-\d{2}-\d{2}$/.test(editingJob.deadline)
    ) {
      setUpdateError("Deadline must be in YYYY-MM-DD format.");
      return;
    }
    setUpdateError(null);

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
      responsibilities: editingJob.responsibilities.split("\n").filter(Boolean),
      location: editingJob.location,
      jd_file_url: editingJob.jd_file_url,
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
        onSuccess: () => onClose(),
        onError: (err) => console.error("Update error:", err),
      },
    );
  };

  return (
    <div className="jd-overlay" onClick={onClose}>
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
            <div className="jd-box">
              <label>Must-Have Skills (comma separated)</label>
              <input
                value={editingJob.skills}
                onChange={(e) =>
                  setEditingJob((prev) => ({
                    ...prev,
                    skills: e.target.value,
                  }))
                }
              />
            </div>
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Salary Range</label>
                <input
                  value={editingJob.salary}
                  onChange={(e) =>
                    setEditingJob((prev) => ({
                      ...prev,
                      salary: e.target.value,
                    }))
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
                    setEditingJob((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="jd-field">
                <label>City</label>
                <input
                  value={editingJob.city}
                  onChange={(e) =>
                    setEditingJob((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
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
                  setEditingJob((prev) => ({
                    ...prev,
                    overview: e.target.value,
                  }))
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
              <button className="jd-back-btn" onClick={onClose}>
                Cancel
              </button>
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
  );
};
