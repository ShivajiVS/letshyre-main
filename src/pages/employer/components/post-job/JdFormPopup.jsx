import React, { useEffect } from "react";
import overlay_img from "@/assets/JD-Upload.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/schemas/employer/jobSchema";

export function JdFormPopup({
  jobData,
  industryOptions,
  setShowJdPopup,
  handlePostJob,
  isPending,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      ...jobData,
      customIndustry: "", // Default to empty string for custom industry
    },
    mode: "all",
  });

  const selectedIndustry = watch("industry_type");

  const onSubmit = (data) => {
    handlePostJob(data);
  };

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
                <input {...register("title")} />
                {errors.title && <span className="jd-error-text">{errors.title.message}</span>}
              </div>

              <div className="jd-field">
                <label>Work Type</label>
                <select className="jd-input" {...register("work_type")}>
                  <option value="">Select Work Type</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
                {errors.work_type && <span className="jd-error-text">{errors.work_type.message}</span>}
              </div>

              <div className="jd-field">
                <label>Employment Type</label>
                <select className="jd-input" {...register("employment_type")}>
                  <option value="">Select Employment Type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
                {errors.employment_type && <span className="jd-error-text">{errors.employment_type.message}</span>}
              </div>
            </div>

            {/* ===== INDUSTRY ===== */}
            <div className="jd-box">
              <label>Industry Type</label>

              <select className="jd-input" {...register("industry_type")}>
                <option value="">Select Industry</option>

                {industryOptions.map((opt, index) => (
                  <option
                    key={`${opt.value}-${index}`}
                    value={opt.value}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.industry_type && <span className="jd-error-text">{errors.industry_type.message}</span>}

              {/* ✅ Custom Industry */}
              {selectedIndustry === "other" && (
                <>
                  <input
                    style={{ marginTop: "8px" }}
                    placeholder="Enter industry"
                    {...register("customIndustry")}
                  />
                  {errors.customIndustry && <span className="jd-error-text">{errors.customIndustry.message}</span>}
                </>
              )}
            </div>

            {/* ===== SKILLS ===== */}
            <div className="jd-box">
              <label>Must-Have Skills (comma separated)</label>
              <input {...register("must_have_skills")} />
              {errors.must_have_skills && <span className="jd-error-text">{errors.must_have_skills.message}</span>}
            </div>

            {/* ===== SALARY + EXPERIENCE + OPENINGS ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Salary Range</label>
                <input {...register("salary_range")} />
                {errors.salary_range && <span className="jd-error-text">{errors.salary_range.message}</span>}
              </div>

              <div className="jd-field">
                <label>Experience Required</label>
                <input {...register("experience_required")} />
                {errors.experience_required && <span className="jd-error-text">{errors.experience_required.message}</span>}
              </div>

              <div className="jd-field">
                <label>Openings</label>
                <input type="number" {...register("number_of_openings")} />
                {errors.number_of_openings && <span className="jd-error-text">{errors.number_of_openings.message}</span>}
              </div>
            </div>

            {/* ===== LOCATION ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Country</label>
                <input {...register("country")} />
                {errors.country && <span className="jd-error-text">{errors.country.message}</span>}
              </div>

              <div className="jd-field">
                <label>State</label>
                <input {...register("state")} />
                {errors.state && <span className="jd-error-text">{errors.state.message}</span>}
              </div>

              <div className="jd-field">
                <label>City</label>
                <input {...register("city")} />
                {errors.city && <span className="jd-error-text">{errors.city.message}</span>}
              </div>
            </div>

            {/* ===== EDUCATION ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Minimum Education</label>
                <input {...register("education")} />
                {errors.education && <span className="jd-error-text">{errors.education.message}</span>}
              </div>

              <div className="jd-field">
                <label>Specialization</label>
                <input {...register("specialization")} />
                {errors.specialization && <span className="jd-error-text">{errors.specialization.message}</span>}
              </div>
            </div>

            {/* ===== DEADLINE ===== */}
            <div className="jd-row-3">
              <div className="jd-field">
                <label>Application Deadline</label>
                <input 
                  type="date" 
                  max="9999-12-31" 
                  min={new Date().toISOString().split("T")[0]}
                  {...register("application_deadline")} 
                />
                {errors.application_deadline && <span className="jd-error-text">{errors.application_deadline.message}</span>}
              </div>
            </div>

            {/* ===== JOB OVERVIEW ===== */}
            <div className="jd-box">
              <label>Job Overview</label>
              <textarea rows={4} {...register("job_description")} />
              {errors.job_description && <span className="jd-error-text">{errors.job_description.message}</span>}
            </div>

            {/* ===== RESPONSIBILITIES ===== */}
            <div className="jd-box">
              <label>Responsibilities</label>
              <textarea rows={5} {...register("description")} />
              {errors.description && <span className="jd-error-text">{errors.description.message}</span>}
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
                onClick={handleSubmit(onSubmit)}
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
