import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import file_img from "@/assets/dragNdrop.png";
import {
  useUploadResume,
  useCheckResumeStatus,
  useGetParsedResumeData,
  useGetSkillsForRole,
} from "../../../../hooks/employee/useProfile";

function StepResume({ onNext, onBack }) {
  const { setValue, watch } = useFormContext();
  const fileRef = useRef(null);

  const uploadResumeMutation = useUploadResume();
  const checkStatusMutation = useCheckResumeStatus();
  const getParsedDataMutation = useGetParsedResumeData();
  const getSkillsMutation = useGetSkillsForRole();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleSkills, setRoleSkills] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [customRole, setCustomRole] = useState("");

  const file = watch("resume");
  const suggestedRoles = watch("suggested_roles") || [];
  const selectedRole = watch("selected_role");
  const parsedData = watch("parsed_resume_data");
  const roleOtherReason = watch("role_other_reason");
  const isCustomRole = selectedRole === "Other" || suggestedRoles.length === 0 || (selectedRole && !suggestedRoles.includes(selectedRole));

  const processResume = async (selectedFile) => {
    setLoading(true);
    setError("");
    setValue("suggested_roles", []);

    try {
      const fd = new FormData();
      fd.append("resume", selectedFile);

      // STEP 1: UPLOAD
      const uploadRes = await uploadResumeMutation.mutateAsync(fd);
      const jobId = uploadRes?.data?.job_id;
      if (!jobId) throw new Error("No job ID received from upload");

      // STEP 2: POLL STATUS
      let attempts = 0;
      const maxAttempts = 15;
      let roles = [];
      let resumeId = "";

      while (attempts < maxAttempts) {
        await new Promise((res) => setTimeout(res, 2000));
        const statusData = await checkStatusMutation.mutateAsync(jobId);
        const jobStatus = statusData?.data?.status;

        if (jobStatus === "completed") {
          const result = statusData.data;
          resumeId = result.ai_resume_id;
          roles = result?.suggested_roles?.roles?.filter(Boolean) || [];
          break;
        }

        if (jobStatus === "failed") {
          throw new Error(statusData?.data?.error_message || "AI processing failed");
        }
        attempts++;
      }

      if (attempts === maxAttempts) {
        throw new Error("AI is taking too long. Please try again.");
      }

      // STEP 3: FETCH PARSED DATA
      const reviewJson = await getParsedDataMutation.mutateAsync(jobId);
      const parsedResume = reviewJson?.data?.data || {};

      // CLEAN ROLES
      const cleanedRoles = [...new Set(roles)].map((r) => r.trim()).filter(Boolean);

      if (!cleanedRoles.length) {
        setError("No roles detected automatically. Please add a custom role.");
      }

      // SET STATE
      setValue("resume", selectedFile);
      setValue("resume_id", resumeId);
      setValue("job_id", jobId);
      setValue("suggested_roles", cleanedRoles);
      setValue("parsed_resume_data", parsedResume);

      if (cleanedRoles.length > 0) {
        setValue("selected_role", cleanedRoles[0]);
        validateRole(cleanedRoles[0], parsedResume);
      }
    } catch (e) {
      console.error(e);
      setError(e.message || "Resume parsing failed");
      setValue("resume", null); // Reset file if failed
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(selectedFile.type)) {
      setError("Only PDF / DOC / DOCX files are allowed");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Maximum file size is 5MB");
      return;
    }

    setValue("resume", selectedFile); // Optimistic UI
    processResume(selectedFile);
  };

  const changeResume = () => {
    setValue("resume", null);
    setValue("resume_id", "");
    setValue("job_id", "");
    setValue("suggested_roles", []);
    setValue("selected_role", "");
    setValue("parsed_resume_data", null);
    setError("");
    setCustomRole("");
    setRoleSkills([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validateRole = async (role, dataContext = parsedData) => {
    if (!role || !dataContext) return;

    try {
      setRoleLoading(true);
      setError("");

      const data = await getSkillsMutation.mutateAsync(role);

      if (data?.data?.needs_clarification) {
        setValue("suggested_roles", data.data.suggestions || []);
        setValue("selected_role", "");
        setCustomRole("");
        setRoleSkills([]);
        setError("⚠️ Please choose a more specific role");
        return;
      }

      const skills = data?.data?.skills || [];
      setRoleSkills(skills);
      setValue("selected_role", role);
      // Optional: attach skills to main form state
      setValue("role_skills", skills);
    } catch (e) {
      console.error(e);
      setError(e.message || "Role validation failed");
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <style>{`
        .upload-area-large {
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: var(--pc-radius-lg);
          padding: 48px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .upload-area-large:hover {
          border-color: var(--pc-secondary);
          background: #f1f5f9;
        }
        .upload-area-large img {
          width: 120px;
          margin-bottom: 24px;
        }
        .upload-area-large h3 {
          font-size: 18px;
          color: var(--pc-text-dark);
          margin-bottom: 8px;
        }
        .upload-area-large p {
          color: #64748b;
          font-size: 13px;
          margin-bottom: 24px;
        }
        .file-active-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: var(--pc-radius-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          border: 1px solid var(--pc-border);
        }
        .file-active-card .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 13px;
          color: var(--pc-text-dark);
        }
        .role-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        .role-card {
          padding: 14px;
          border: 1px solid var(--pc-border);
          border-radius: var(--pc-radius-md);
          text-align: center;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.2s ease;
          background: #ffffff;
          color: var(--pc-text-dark);
        }
        .role-card:hover {
          border-color: var(--pc-secondary);
          box-shadow: var(--pc-shadow-soft);
        }
        .role-card.active {
          background: var(--pc-secondary);
          border-color: var(--pc-secondary);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(62, 126, 244, 0.3);
        }

        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: loading-skeleton 1.5s infinite;
        }
        @keyframes loading-skeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skill-badge {
          background: #e0e7ff;
          color: #3730a3;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }
      `}</style>

      <div className="pc-step-content">
        {!file && (
          <div className="upload-area-large" onClick={() => fileRef.current.click()}>
            <img src={file_img} alt="Drag and drop" />
            <h3>Upload your Resume</h3>
            <p>Our AI will automatically extract your details and suggest roles.</p>
            <button type="button" className="btn-primary">Select File</button>
          </div>
        )}

        {file && (
          <>
            <div className="file-active-card">
              <div className="file-info">
                <i className="bi bi-file-earmark-pdf text-red-500 text-2xl"></i>
                {file.name}
              </div>
              <button type="button" className="btn-secondary" onClick={changeResume}>
                Change File
              </button>
            </div>

            {loading ? (
              <div style={{ marginTop: 32 }} className="resume-skeleton-container">
                <div className="skeleton" style={{ width: 160, height: 22, marginBottom: 12, borderRadius: 4 }}></div>
                <div className="skeleton" style={{ width: "50%", height: 14, marginBottom: 28, borderRadius: 4 }}></div>

                <div className="role-grid">
                  <div className="skeleton" style={{ height: 48, borderRadius: 12 }}></div>
                  <div className="skeleton" style={{ height: 48, borderRadius: 12 }}></div>
                  <div className="skeleton" style={{ height: 48, borderRadius: 12 }}></div>
                  <div className="skeleton" style={{ height: 48, borderRadius: 12 }}></div>
                </div>

                <div style={{ marginTop: 40 }}>
                  <div className="skeleton" style={{ width: 220, height: 16, marginBottom: 16, borderRadius: 4 }}></div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 20 }}></div>
                    <div className="skeleton" style={{ width: 120, height: 28, borderRadius: 20 }}></div>
                    <div className="skeleton" style={{ width: 90, height: 28, borderRadius: 20 }}></div>
                    <div className="skeleton" style={{ width: 110, height: 28, borderRadius: 20 }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {suggestedRoles.length > 0 ? (
                  <>
                    <h3 style={{ color: "var(--pc-text-dark)", fontSize: 18, marginBottom: 8 }}>
                      {error ? "Refined Role Suggestions" : "Select Your Role"}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: 13 }}>
                      Based on your resume, our AI suggests these roles. Select one to proceed.
                    </p>

                    <div className="role-grid">
                      {suggestedRoles.map((role, i) => (
                        <div
                          key={i}
                          className={`role-card ${selectedRole === role ? "active" : ""}`}
                          onClick={() => {
                            setValue("selected_role", role);
                            setRoleSkills([]);
                            validateRole(role);
                          }}
                        >
                          {role}
                        </div>
                      ))}
                      <div
                        className={`role-card ${selectedRole === "Other" ? "active" : ""}`}
                        onClick={() => setValue("selected_role", "Other")}
                      >
                        + Other Role
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="error-msg" style={{ marginTop: 20 }}>
                    ⚠️ No roles were detected automatically. Please add a custom role below.
                  </div>
                )}

                {isCustomRole && !loading && (
                  <div style={{ marginTop: 24, padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 13, color: "var(--pc-text-dark)" }}>Enter Custom Role *</label>
                    <input
                      className="pc-input"
                      value={customRole}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomRole(value);
                        setRoleSkills([]);

                        if (typingTimeout) clearTimeout(typingTimeout);

                        const timeout = setTimeout(() => {
                          if (value.length >= 4 && !value.endsWith(" ")) {
                            validateRole(value);
                          }
                        }, 800);

                        setTypingTimeout(timeout);
                      }}
                      placeholder="e.g. Frontend Developer"
                      disabled={roleLoading}
                    />
                    </div>
                    
                    <div>
                      <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 13, color: "var(--pc-text-dark)" }}>Reason for selecting another role *</label>
                      <textarea
                        className="pc-input"
                        placeholder="Why is this custom role a better fit for you?"
                        style={{ minHeight: "80px", resize: "vertical" }}
                        value={roleOtherReason}
                        onChange={(e) => setValue("role_other_reason", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {roleLoading ? (
                  <div style={{ marginTop: 32 }}>
                    <div className="skeleton" style={{ width: 220, height: 16, marginBottom: 16, borderRadius: 4 }}></div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      <div className="skeleton" style={{ width: 70, height: 28, borderRadius: 20 }}></div>
                      <div className="skeleton" style={{ width: 110, height: 28, borderRadius: 20 }}></div>
                      <div className="skeleton" style={{ width: 90, height: 28, borderRadius: 20 }}></div>
                      <div className="skeleton" style={{ width: 130, height: 28, borderRadius: 20 }}></div>
                      <div className="skeleton" style={{ width: 85, height: 28, borderRadius: 20 }}></div>
                    </div>
                  </div>
                ) : roleSkills.length > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <h4 style={{ color: "var(--pc-text-dark)", marginBottom: 12, fontSize: 14 }}>Suggested Skills for {selectedRole}</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {roleSkills.map((skill, i) => (
                        <span key={i} className="skill-badge">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}

        {error && !loading && (
          <div className="error-msg" style={{ marginTop: 24 }}>
            {error}
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => file && processResume(file)}
              >
                Retry Processing
              </button>
            </div>
          </div>
        )}

        <input
          hidden
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <div className="pc-actions">
          <button type="button" className="btn-secondary" onClick={onBack}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
          {file && !loading && selectedRole && !roleLoading && (
            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => {
                if (isCustomRole && (!roleOtherReason || roleOtherReason.trim() === "")) {
                  setError("Please provide a reason for selecting a custom role.");
                  return;
                }
                onNext();
              }}
            >
              Continue <i className="bi bi-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default StepResume;
