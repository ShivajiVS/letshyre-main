import { useState, useEffect } from "react";

export default function JobDescriptionModal({ job, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title === "All Jobs" ? "General Application" : job.title,
        workType: job.details.workType,
        employmentType: job.details.employmentType,
        mustHaveStr: job.details.mustHave.join(", "),
        niceToHaveStr: job.details.niceToHave.join(", "),
        salary: job.details.salary,
        location: job.details.location,
        education: job.details.education,
        responsibilitiesStr: job.details.responsibilities.join("\n"),
      });
      setIsEditing(false);
      setErrors({}); // Clear errors when opening
    }
  }, [job]);

  // Handle Input Changes & Clear specific error as user types
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error for this field once the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // --- NEW: Validation Logic ---
  const validateForm = () => {
    const newErrors = {};

    // Check basic text fields
    if (!formData.title.trim()) newErrors.title = "Job Title is required.";
    if (!formData.workType.trim())
      newErrors.workType = "Work Type is required.";
    if (!formData.employmentType.trim())
      newErrors.employmentType = "Employment Type is required.";
    if (!formData.salary.trim()) newErrors.salary = "Salary Range is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.education.trim())
      newErrors.education = "Education is required.";

    // Check lists (Must have at least one valid item)
    const mustHaveList = formData.mustHaveStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (mustHaveList.length === 0)
      newErrors.mustHaveStr = "At least one skill is required.";

    const respList = formData.responsibilitiesStr
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (respList.length === 0)
      newErrors.responsibilitiesStr =
        "At least one responsibility is required.";

    // Nice-to-have is optional, so we skip validating it.

    setErrors(newErrors);

    // If newErrors has no keys, the form is valid (returns true)
    return Object.keys(newErrors).length === 0;
  };

  // Mock API Save Function
  const handleSaveToAPI = async () => {
    // Run validation before saving
    if (!validateForm()) {
      return; // Stop the save process if validation fails
    }

    const payload = {
      title: formData.title,
      details: {
        workType: formData.workType,
        employmentType: formData.employmentType,
        salary: formData.salary,
        location: formData.location,
        education: formData.education,
        mustHave: formData.mustHaveStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        niceToHave: formData.niceToHaveStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        responsibilities: formData.responsibilitiesStr
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    };

    console.log("🚀 Sending data to API...", payload);
    alert("Data saved successfully! Check console for payload.");

    setIsEditing(false);
  };

  if (!formData) return null;

  return (
    <div
      className="ho-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ho-modal-large">
        <div className="ho-modal-header-top">
          <h2 className="ho-modal-title-text">Job Description</h2>
          {!isEditing ? (
            <button
              className="ho-modal-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                width="16"
                height="16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit
            </button>
          ) : (
            <button
              className="ho-modal-edit-btn ho-modal-cancel-btn"
              onClick={() => {
                setIsEditing(false);
                setErrors({}); // Clear errors if they cancel
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="ho-modal-scroll-container">
          <div
            className={`ho-modal-fieldset ${isEditing ? "ho-is-editing" : ""}`}
          >
            <h4 className="ho-modal-legend">Refine Your New Listing</h4>

            <div className="ho-form-row ho-form-row-3">
              <div className="ho-input-wrap">
                <label className={errors.title ? "ho-label-error" : ""}>
                  Job Title
                </label>
                <input
                  className={errors.title ? "ho-input-error" : ""}
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  readOnly={!isEditing}
                />
                {errors.title && (
                  <span className="ho-error-msg">{errors.title}</span>
                )}
              </div>
              <div className="ho-input-wrap">
                <label className={errors.workType ? "ho-label-error" : ""}>
                  Work Type
                </label>
                <input
                  className={errors.workType ? "ho-input-error" : ""}
                  type="text"
                  name="workType"
                  value={formData.workType}
                  onChange={handleFormChange}
                  readOnly={!isEditing}
                />
                {errors.workType && (
                  <span className="ho-error-msg">{errors.workType}</span>
                )}
              </div>
              <div className="ho-input-wrap">
                <label
                  className={errors.employmentType ? "ho-label-error" : ""}
                >
                  Employment type
                </label>
                <input
                  className={errors.employmentType ? "ho-input-error" : ""}
                  type="text"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleFormChange}
                  readOnly={!isEditing}
                />
                {errors.employmentType && (
                  <span className="ho-error-msg">{errors.employmentType}</span>
                )}
              </div>
            </div>

            <div className="ho-form-row">
              <div className="ho-input-wrap">
                <label className={errors.mustHaveStr ? "ho-label-error" : ""}>
                  Must-Have Skills
                </label>
                {isEditing ? (
                  <>
                    <input
                      className={errors.mustHaveStr ? "ho-input-error" : ""}
                      type="text"
                      name="mustHaveStr"
                      value={formData.mustHaveStr}
                      onChange={handleFormChange}
                      placeholder="e.g. React, Node.js (Comma separated)"
                    />
                    {errors.mustHaveStr && (
                      <span className="ho-error-msg">{errors.mustHaveStr}</span>
                    )}
                  </>
                ) : (
                  <div className="ho-fake-input ho-skills-box">
                    {formData.mustHaveStr
                      .split(",")
                      .filter(Boolean)
                      .map((s, i) => (
                        <span key={i} className="ho-skill-chip">
                          {s.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ho-form-row">
              <div className="ho-input-wrap">
                <label>Nice-to-Have Skills</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="niceToHaveStr"
                    value={formData.niceToHaveStr}
                    onChange={handleFormChange}
                    placeholder="e.g. Docker, AWS (Comma separated)"
                  />
                ) : (
                  <div className="ho-fake-input ho-skills-box">
                    {formData.niceToHaveStr
                      .split(",")
                      .filter(Boolean)
                      .map((s, i) => (
                        <span key={i} className="ho-skill-chip">
                          {s.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ho-form-row ho-form-row-3">
              <div className="ho-input-wrap">
                <label className={errors.salary ? "ho-label-error" : ""}>
                  Salary Range
                </label>
                <input
                  className={errors.salary ? "ho-input-error" : ""}
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleFormChange}
                  readOnly={!isEditing}
                />
                {errors.salary && (
                  <span className="ho-error-msg">{errors.salary}</span>
                )}
              </div>
              <div className="ho-input-wrap">
                <label className={errors.location ? "ho-label-error" : ""}>
                  Location
                </label>
                <input
                  className={errors.location ? "ho-input-error" : ""}
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  readOnly={!isEditing}
                />
                {errors.location && (
                  <span className="ho-error-msg">{errors.location}</span>
                )}
              </div>
              <div className="ho-input-wrap">
                <label className={errors.education ? "ho-label-error" : ""}>
                  Education
                </label>
                <input
                  className={errors.education ? "ho-input-error" : ""}
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleFormChange}
                  readOnly={!isEditing}
                />
                {errors.education && (
                  <span className="ho-error-msg">{errors.education}</span>
                )}
              </div>
            </div>

            <div className="ho-form-row">
              <div className="ho-input-wrap">
                <label
                  className={errors.responsibilitiesStr ? "ho-label-error" : ""}
                >
                  Responsibilities
                </label>
                {isEditing ? (
                  <>
                    <textarea
                      className={
                        errors.responsibilitiesStr ? "ho-input-error" : ""
                      }
                      name="responsibilitiesStr"
                      value={formData.responsibilitiesStr}
                      onChange={handleFormChange}
                      rows={4}
                      placeholder="Enter responsibilities, separated by new lines"
                    />
                    {errors.responsibilitiesStr && (
                      <span className="ho-error-msg">
                        {errors.responsibilitiesStr}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="ho-fake-input ho-resp-box">
                    <ul>
                      {formData.responsibilitiesStr
                        .split("\n")
                        .filter(Boolean)
                        .map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="ho-modal-footer-action">
          {isEditing ? (
            <button
              className="ho-proceed-btn ho-save-btn"
              onClick={handleSaveToAPI}
            >
              Save Changes
            </button>
          ) : (
            <button className="ho-proceed-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
