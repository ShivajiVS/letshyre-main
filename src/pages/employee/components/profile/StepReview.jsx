import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { useSubmitProfile } from "../../../../hooks/employee/useProfile";

function StepReview({ onBack, onFinish }) {
  const { watch, getValues } = useFormContext();
  const submitProfileMutation = useSubmitProfile();

  const [error, setError] = useState("");
  const [photoSrc, setPhotoSrc] = useState(null);

  // Retrieve all values
  const profileData = getValues();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Safe Fallbacks
  const company = profileData.present_or_last_working_company || "-";
  const lastWorking = profileData.last_day_of_working || "-";
  const currentCtc = profileData.current_ctc || "-";
  const expectedCtc = profileData.expected_ctc || "-";
  const industry = profileData.preferred_industry || "-";
  const locations = Array.isArray(profileData.preferred_locations)
    ? profileData.preferred_locations.join(", ")
    : profileData.preferred_locations || "-";
  const gender = profileData.gender || "-";
  const dob = profileData.dob || "-";
  const location = profileData.location || "-";
  const profilePhoto = profileData.profile_photo || null;
  const resume = profileData.resume || null;

  const finalRoles = profileData.selected_role
    ? [profileData.selected_role]
    : profileData.suggested_roles?.length
      ? profileData.suggested_roles
      : [];

  const parsed = profileData.parsed_resume_data;
  const finalParsed = parsed?.data || parsed || {};

  const resumeReview = {
    skills: finalParsed.skills || [],
    certifications: finalParsed.certifications || [],
    education: finalParsed.education || [],
    projects: finalParsed.projects || [],
    experience: finalParsed.experience || [],
    total_experience: finalParsed.total_experience || "",
    role_wise_experience: finalParsed.role_wise_experience || [],
  };

  useEffect(() => {
    if (!profilePhoto) return;
    if (typeof profilePhoto === "string") {
      setPhotoSrc(profilePhoto);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePhoto);
    setPhotoSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePhoto]);

  const handleSubmit = async () => {
    setError("");

    try {
      const fd = new FormData();

      // IDENTITY
      fd.append("gender", profileData.gender || "");
      fd.append("dob", profileData.dob || "");

      const cleanAadhaar = (profileData.aadhar_number || "").replace(/\D/g, "");
      fd.append("aadhar_number", cleanAadhaar);
      fd.append("location", profileData.location || "");
      fd.append("address", profileData.address || "");

      if (
        profileData.profile_photo &&
        typeof profileData.profile_photo !== "string"
      ) {
        fd.append(
          "profile_photo",
          profileData.profile_photo,
          profileData.profile_photo.name || "profile_photo.png",
        );
      }

      // JOB DETAILS
      fd.append(
        "present_or_last_working_company",
        profileData.present_or_last_working_company || "",
      );
      fd.append("last_day_of_working", profileData.last_day_of_working || "");
      fd.append("current_ctc", profileData.current_ctc || "");
      fd.append("expected_ctc", profileData.expected_ctc || "");
      fd.append("preferred_industry", profileData.preferred_industry || "");
      fd.append(
        "preferred_locations",
        JSON.stringify(profileData.preferred_locations || []),
      );

      if (profileData.resignation_letter)
        fd.append("resignation_letter", profileData.resignation_letter);
      if (profileData.experience_letter)
        fd.append("experience_letter", profileData.experience_letter);
      if (profileData.present_offer)
        fd.append("present_offer", profileData.present_offer);
      fd.append(
        "notice_period_proof_type",
        profileData.notice_period_proof_type || "",
      );
      if (profileData.notice_period_proof)
        fd.append("notice_period_proof", profileData.notice_period_proof);

      // RESUME & ROLE
      if (profileData.resume) fd.append("resume", profileData.resume);
      fd.append("resume_id", profileData.resume_id || "");
      fd.append("role", profileData.selected_role || "");
      fd.append("selected_role", profileData.selected_role || "");
      fd.append("role_other_reason", profileData.role_other_reason || "");

      // PARSED DATA
      fd.append("parsed_resume_data", JSON.stringify(resumeReview || {}));
      fd.append("education", JSON.stringify(resumeReview.education || []));
      fd.append("experience", JSON.stringify(resumeReview.experience || []));
      fd.append("projects", JSON.stringify(resumeReview.projects || []));
      fd.append(
        "certifications",
        JSON.stringify(resumeReview.certifications || []),
      );

      // Calculate Total Exp
      let totalExpYears = 0;
      (resumeReview.experience || []).forEach((exp) => {
        if (!exp?.duration) return;
        const yearMatch = exp.duration.match(/(\d+)\s*year/);
        const monthMatch = exp.duration.match(/(\d+)\s*month/);
        const years = yearMatch ? parseInt(yearMatch[1]) : 0;
        const months = monthMatch ? parseInt(monthMatch[1]) : 0;
        totalExpYears += years + months / 12;
      });
      fd.append("total_experience_years", totalExpYears.toFixed(1));

      // Role-wise Exp
      const techExp = {};
      (resumeReview.experience || []).forEach((exp) => {
        if (!exp?.role) return;
        if (!techExp[exp.role]) techExp[exp.role] = 0;
        techExp[exp.role] += 1;
      });
      fd.append("tech_experience", JSON.stringify(techExp));

      fd.append("profile_completion_score", "100");
      fd.append("is_profile_complete", "true");

      await submitProfileMutation.mutateAsync(fd);
      onFinish();
    } catch (e) {
      console.error(e);
      if (e.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      let errorMessage = "Profile submission failed. Please try again.";

      if (e.response?.data) {
        const responseData = e.response.data;

        if (responseData.data && typeof responseData.data === "object") {
          // Extract the first field validation error (e.g. from 'aadhar_number')
          const firstErrorKey = Object.keys(responseData.data)[0];
          const firstErrorArray = responseData.data[firstErrorKey];

          if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
            errorMessage = firstErrorArray[0];
          } else if (typeof firstErrorArray === "string") {
            errorMessage = firstErrorArray;
          }
        } else if (responseData.message) {
          // Fallback to the top-level message (e.g., "Validation failed.")
          errorMessage = responseData.message;
        }
      } else if (e.message) {
        errorMessage = e.message;
      }

      setError(errorMessage);
    }
  };

  const isPending = submitProfileMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pc-step-content"
    >
      <style>{`
        .review-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          align-items: start;
        }
        .overlay-loader {
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.4);
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          text-align: center;
        }
        .pc-spinner-modern {
          width: 54px;
          height: 54px;
          border: 4px solid #e2e8f0;
          border-top-color: var(--pc-secondary);
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
        }
        .loader-title {
          margin-top: 24px;
          color: var(--pc-text-dark);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .loader-subtitle {
          color: #64748b;
          font-size: 15px;
          margin-top: 8px;
          font-weight: 500;
        }
        .review-left {
          background: #ffffff;
          padding: 32px 24px;
          border-radius: var(--pc-radius-lg);
          text-align: center;
          border: 1px solid var(--pc-border);
          box-shadow: var(--pc-shadow-soft);
          height: fit-content;
        }
        .review-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 16px;
          border: 4px solid #f8fafc;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .review-name {
          font-size: 20px;
          font-weight: 700;
          color: var(--pc-text-dark);
          margin-bottom: 8px;
        }
        .review-meta {
          color: #64748b;
          font-size: 14px;
          line-height: 1.8;
        }
        .review-meta p { margin: 0; }
        
        .review-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .review-section {
          background: #ffffff;
          padding: 24px;
          border-radius: var(--pc-radius-lg);
          border: 1px solid var(--pc-border);
          box-shadow: var(--pc-shadow-soft);
          transition: transform 0.2s ease;
        }
        .review-section:hover {
          transform: translateY(-2px);
          box-shadow: var(--pc-shadow-hover);
        }
        .review-section h4 {
          color: var(--pc-secondary);
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .info-item {
          background: #f8fafc;
          padding: 16px;
          border-radius: var(--pc-radius-md);
        }
        .info-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 15px;
          color: var(--pc-text-dark);
          font-weight: 600;
        }
        
        .badges-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .badge-solid {
          background: var(--pc-secondary);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }
        .badge-outline {
          background: #f1f5f9;
          color: #334155;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }
        
        .list-card {
          background: #f8fafc;
          padding: 16px;
          border-radius: var(--pc-radius-md);
          margin-bottom: 12px;
          border: 1px solid #e2e8f0;
        }
        .list-card:last-child { margin-bottom: 0; }
        .list-title { font-weight: 700; color: var(--pc-text-dark); font-size: 15px; }
        .list-subtitle { color: var(--pc-secondary); font-size: 14px; font-weight: 600; margin: 4px 0; }
        .list-desc { color: #64748b; font-size: 14px; line-height: 1.5; margin-top: 8px; }

        /* Skeletons */
        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: loading-skeleton 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes loading-skeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .overlay-loader {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 900px) {
          .review-layout { grid-template-columns: 1fr; }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {isPending &&
        createPortal(
          <div className="overlay-loader">
            <div className="pc-spinner-modern"></div>
            <h2 className="loader-title">Submitting profile...</h2>
            <p className="loader-subtitle">Please wait a moment.</p>
          </div>,
          document.body,
        )}

      <div className="review-layout">
        <div className="review-left">
          {photoSrc ? (
            <img src={photoSrc} className="review-avatar" alt="Candidate" />
          ) : (
            <div
              className="review-avatar"
              style={{ background: "#f1f5f9", display: "inline-block" }}
            />
          )}
          <div className="review-name">{user?.name || "Candidate"}</div>
          <div className="review-meta">
            <p>
              {gender} • {dob}
            </p>
            <p>{location}</p>
            <div
              style={{
                marginTop: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#dcfce7",
                color: "#16a34a",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <i className="bi bi-shield-check"></i> Aadhaar Verified
            </div>
          </div>
        </div>

        <div className="review-right">
          <div className="review-section">
            <h4>
              <i className="bi bi-briefcase"></i> Job Preferences
            </h4>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Current Company</div>
                <div className="info-value">{company}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Last Working Day</div>
                <div className="info-value">{lastWorking}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Current CTC</div>
                <div className="info-value">{currentCtc} LPA</div>
              </div>
              <div className="info-item">
                <div className="info-label">Expected CTC</div>
                <div className="info-value">{expectedCtc} LPA</div>
              </div>
              <div className="info-item">
                <div className="info-label">Industry</div>
                <div className="info-value">{industry}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Locations</div>
                <div className="info-value">{locations}</div>
              </div>
            </div>
          </div>

          <div className="review-section">
            <h4>
              <i className="bi bi-person-badge"></i> Selected Roles
            </h4>
            <div className="badges-wrap">
              {finalRoles.map((r, i) => (
                <span key={i} className="badge-solid">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="review-section">
            <h4>
              <i className="bi bi-lightning"></i> Top Skills Extracted
            </h4>
            <div className="badges-wrap">
              {resumeReview.skills.length > 0 ? (
                resumeReview.skills.map((s, i) => (
                  <span key={i} className="badge-outline">
                    {s}
                  </span>
                ))
              ) : (
                <span className="info-value" style={{ fontWeight: 400 }}>
                  No specific skills extracted.
                </span>
              )}
            </div>
          </div>

          <div className="review-section">
            <h4>
              <i className="bi bi-journal-check"></i> Experience
            </h4>
            {resumeReview.experience.length === 0 ? (
              <div className="list-card">No experience data found.</div>
            ) : (
              resumeReview.experience.map((e, i) => (
                <div key={i} className="list-card">
                  {typeof e === "string" ? (
                    e
                  ) : (
                    <>
                      <div className="list-title">{e.role}</div>
                      <div className="list-subtitle">
                        {e.company} • {e.duration}
                      </div>
                      <div className="list-desc">{e.description}</div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="review-section">
            <h4>
              <i className="bi bi-mortarboard"></i> Education
            </h4>
            {resumeReview.education.length === 0 ? (
              <div className="list-card">No education data found.</div>
            ) : (
              resumeReview.education.map((e, i) => (
                <div key={i} className="list-card">
                  {typeof e === "string" ? (
                    e
                  ) : (
                    <>
                      <div className="list-title">{e.degree || "N/A"}</div>
                      <div className="list-subtitle">
                        {e.institution || "N/A"}
                      </div>
                      <div className="list-desc" style={{ marginTop: 0 }}>
                        {e.duration || ""}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div className="pc-actions">
            <button
              className="btn-secondary"
              onClick={onBack}
              disabled={isPending}
            >
              <i className="bi bi-arrow-left"></i> Back to Edit
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isPending}
            >
              Confirm & Submit <i className="bi bi-check-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default StepReview;
