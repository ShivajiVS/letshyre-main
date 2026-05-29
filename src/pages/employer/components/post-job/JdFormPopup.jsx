import React from "react";
import overlay_img from "@/assets/JD-Upload.png";

export function JdFormPopup({
  jobData,
  handleChange,
  industryOptions,
  customIndustry,
  setCustomIndustry,
  setShowJdPopup,
  handlePostJob,
  isPending,
}) {
  return (
    <div className="jd-overlay">
      <div className="jd-card-main">
        <h2 className="jd-heading">Role Ready!</h2>

        <div className="jd-card">
          <div className="jd-left">
            <img className="jd-upload-img" src={overlay_img} alt="" />
            <h4>Verify Your Job Details</h4>
            <p>Our AI has parsed your JD. Review everything before posting.</p>
          </div>

          <div className="jd-right">
            <h3 className="jd-title">Refine Your New Listing</h3>

            {/* ===== BASIC INFO ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Job Title</label>
                <input
                  value={jobData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="jd-field">
                <label>Work Type</label>
                <select
                  className="jd-input"
                  value={jobData.work_type}
                  onChange={(e) => handleChange("work_type", e.target.value)}
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div className="jd-field">
                <label>Employment Type</label>
                <select
                  className="jd-input"
                  value={jobData.employment_type}
                  onChange={(e) =>
                    handleChange("employment_type", e.target.value)
                  }
                >
                  <option value="Full-Time Employee">Full-Time Employee</option>
                  <option value="Part-Time Employee">Part-Time Employee</option>
                </select>
              </div>
            </div>

            {/* ===== INDUSTRY ===== */}
            <div className="jd-box">
              <label>Industry Type</label>

              <select
                className="jd-input"
                value={jobData.industry_type}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("industry_type", value);

                  // reset custom if not other
                  if (value !== "other") {
                    setCustomIndustry("");
                  }
                }}
              >
                <option value="">Select Industry</option>

                {industryOptions.map((opt, index) => (
                  <option
                    key={`${opt.value}-${index}`} // ✅ avoids duplicate key issue
                    value={opt.value}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* ✅ Custom Industry */}
              {jobData.industry_type === "other" && (
                <input
                  style={{ marginTop: "8px" }}
                  placeholder="Enter industry"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                />
              )}
            </div>

            {/* ===== SKILLS ===== */}
            <div className="jd-box">
              <label>Must-Have Skills (comma separated)</label>
              <input
                value={jobData.must_have_skills}
                onChange={(e) =>
                  handleChange("must_have_skills", e.target.value)
                }
              />
            </div>

            {/* ===== SALARY + EXPERIENCE + OPENINGS ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Salary Range</label>
                <input
                  value={jobData.salary_range}
                  onChange={(e) => handleChange("salary_range", e.target.value)}
                />
              </div>

              <div className="jd-field">
                <label>Experience Required</label>
                <input
                  value={jobData.experience_required}
                  onChange={(e) =>
                    handleChange("experience_required", e.target.value)
                  }
                />
              </div>

              <div className="jd-field">
                <label>Openings</label>
                <input
                  type="number"
                  value={jobData.number_of_openings}
                  onChange={(e) =>
                    handleChange("number_of_openings", e.target.value)
                  }
                />
              </div>
            </div>

            {/* ===== LOCATION ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Country</label>
                <input
                  value={jobData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>

              <div className="jd-field">
                <label>State</label>
                <input
                  value={jobData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>

              <div className="jd-field">
                <label>City</label>
                <input
                  value={jobData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
            </div>

            {/* ===== EDUCATION ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Minimum Education</label>
                <input
                  value={jobData.education}
                  onChange={(e) => handleChange("education", e.target.value)}
                />
              </div>

              <div className="jd-field">
                <label>Specialization</label>
                <input
                  value={jobData.specialization}
                  onChange={(e) =>
                    handleChange("specialization", e.target.value)
                  }
                />
              </div>
            </div>

            {/* ===== DEADLINE ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Application Deadline</label>
                <input
                  type="date"
                  value={jobData.application_deadline}
                  onChange={(e) =>
                    handleChange("application_deadline", e.target.value)
                  }
                />
              </div>
            </div>

            {/* ===== JOB OVERVIEW ===== */}
            <div className="jd-box">
              <label>Job Overview</label>
              <textarea
                value={jobData.job_description}
                onChange={(e) =>
                  handleChange("job_description", e.target.value)
                }
                rows={4}
              />
            </div>

            {/* ===== RESPONSIBILITIES ===== */}
            <div className="jd-box">
              <label>Responsibilities</label>
              <textarea
                value={jobData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
              />
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="jd-actions">
              <button
                className="jd-back-btn"
                onClick={() => setShowJdPopup(false)}
              >
                Go Back
              </button>

              <button
                className="jd-post-btn"
                onClick={handlePostJob}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="jd-spinner"></span>
                    Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
