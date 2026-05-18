import { useRef, useState } from "react";
import file_img from "@/assets/dragNdrop.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ENDPOINTS = {
  UPLOAD: "/user/v1/candidate_resume_ai/upload/",
  STATUS: (jobId) =>
    `/user/v1/candidate_resume_ai/status/${jobId}/`,
};

/* ✅ UNIVERSAL TOKEN GETTER */
const getToken = () => {
  let token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token");

  // if stored as JSON user object
  if (!token) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      token = user?.access_token || user?.access;
    } catch {}
  }

  // remove quotes issue
  if (token && token.startsWith('"')) {
    token = token.replace(/"/g, "");
  }

  return token;
};

function StepResume({ onNext, onBack, setProfileData, profileData = {} }) {
  const fileRef = useRef(null);

  const [file, setFile] = useState(profileData.resume || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleSkills, setRoleSkills] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const [suggestedRoles, setSuggestedRoles] = useState(
    profileData.suggested_roles || []
  );

  const [selectedRole, setSelectedRole] = useState(
    profileData.selected_role || ""
  );

  const [customRole, setCustomRole] = useState(
    profileData.selected_role &&
      !(profileData.suggested_roles || []).includes(profileData.selected_role)
      ? profileData.selected_role
      : ""
  );

  /* -----------------------
  UPLOAD + PARSE
  ----------------------- */

  const uploadResume = async (selectedFile) => {
    setLoading(true);
    setError("");
    setSuggestedRoles([]);

    try {
      const token = getToken();

      console.log("TOKEN:", token);

      if (!token) {
        throw new Error("User not logged in. Please login again.");
      }

      const fd = new FormData();
      fd.append("resume", selectedFile);

      /* STEP 1: UPLOAD */

      const uploadRes = await fetch(
        `${API_BASE}${ENDPOINTS.UPLOAD}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        }
      );

      console.log("UPLOAD STATUS:", uploadRes.status);

      if (!uploadRes.ok) {
        throw new Error(`Resume upload failed (${uploadRes.status})`);
      }

      const uploadData = await uploadRes.json();
      const jobId = uploadData?.data?.job_id;

      if (!jobId) {
        throw new Error("No job ID received");
      }

      /* STEP 2: POLL STATUS */

      let attempts = 0;
      const maxAttempts = 15;
      let roles = [];
      let resumeId = "";

      while (attempts < maxAttempts) {
        await new Promise((res) => setTimeout(res, 2000));

        const statusRes = await fetch(
          `${API_BASE}${ENDPOINTS.STATUS(jobId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!statusRes.ok) {
          throw new Error("Failed to fetch job status");
        }

        const statusData = await statusRes.json();
        const jobStatus = statusData?.data?.status;

        console.log("JOB STATUS:", jobStatus);

        if (jobStatus === "completed") {
          const result = statusData.data;

          resumeId = result.ai_resume_id;

          roles =
            result?.suggested_roles?.roles?.filter(Boolean) || [];

          break;
        }

        if (jobStatus === "failed") {
          throw new Error(
            statusData?.data?.error_message || "AI processing failed"
          );
        }

        attempts++;
      }

      if (attempts === maxAttempts) {
        throw new Error("AI is taking too long. Please try again.");
      }

      /* STEP 3: FETCH PARSED RESUME DATA */

      const reviewRes = await fetch(
        `${API_BASE}/user/v1/candidate_resume_ai/review_data/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!reviewRes.ok) {
        throw new Error("Failed to fetch parsed resume data");
      }

      const reviewJson = await reviewRes.json();

      const parsedData = reviewJson?.data?.data || {};

      console.log("PARSED DATA:", parsedData);

      /* CLEAN ROLES */

      const cleanedRoles = [...new Set(roles)]
        .map((r) => r.trim())
        .filter(Boolean);

      setSuggestedRoles(cleanedRoles);

      if (!cleanedRoles.length) {
        setError("No roles detected. Add custom role.");
      }

      /* AUTO SELECT FIRST ROLE */

      if (cleanedRoles.length > 0) {
        setSelectedRole(cleanedRoles[0]);
      }

      /* SAVE STATE */

      setProfileData((prev) => ({
        ...prev,
        resume: selectedFile,
        resume_id: resumeId,
        job_id: jobId,
        suggested_roles: cleanedRoles,
        parsed_resume_data: parsedData, // 🔥 ADD THIS
      }));
    } catch (e) {
      console.error(e);
      setError(e.message || "Resume parsing failed");
    } finally {
      setLoading(false);
    }
  };

  /* FILE VALIDATION */

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(selectedFile.type)) {
      setError("Only PDF / DOC / DOCX allowed");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Maximum 5MB allowed");
      return;
    }

    setFile(selectedFile);
    uploadResume(selectedFile);
  };

  /* CHANGE RESUME */

  const changeResume = () => {
    setFile(null);
    setError("");
    setSuggestedRoles([]);
    setSelectedRole("");
    setCustomRole("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setProfileData((prev) => ({
      ...prev,
      resume: null,
      resume_id: "",
      job_id: "",
      suggested_roles: [],
      selected_role: "",
      parsed_resume_data: null,
    }));
  };

  /* CONTINUE */

  const handleContinue = () => {
    onNext();
  };

  const validateRole = async (role) => {
    if (!role || !profileData.parsed_resume_data) return;

    try {
      setRoleLoading(true);
      setError("");

      const token = getToken();

      const res = await fetch(
        `${API_BASE}/user/v1/candidate_resume_ai/skills_for_role/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      if (!res.ok) throw new Error("Failed to validate role");

      const data = await res.json();

      // ❌ unclear role → suggestions
      if (data?.data?.needs_clarification) {
        setSuggestedRoles(data.data.suggestions || []);
        setSelectedRole("");
        setCustomRole("");
        setRoleSkills([]);
        setError("⚠️ Please choose a more specific role");
        return;
      }

      // ✅ valid role → skills
      const skills = data?.data?.skills || [];

      setRoleSkills(skills);

      setProfileData((prev) => ({
        ...prev,
        selected_role: role,
        role_skills: skills,
      }));

    } catch (e) {
      console.error(e);
      setError(e.message || "Role validation failed");
    } finally {
      setRoleLoading(false);
    }
  };

  return (
   
    <>
      <style>{`
.resume-role-card{
padding:24px;
background:#fff;
border-radius:24px;
box-shadow:0 8px 28px rgba(0,0,0,.05);
}
.upload-box{
background:#eef4ff;
border:2px dashed #9bc0ff;
border-radius:26px;
padding:38px;
text-align:center;
cursor:pointer;
}
.upload-img{
width:110px;
margin-bottom:18px;
}
.upload-head{
font-size:28px;
font-weight:700;
color:#4d7eff;
}
.upload-sub{
margin-top:10px;
font-size:14px;
color:#666;
margin-bottom:22px;
}
.upload-btn{
background:#4d7eff;
color:#fff;
border:none;
padding:13px 26px;
border-radius:12px;
}
.resume-top{
background:#f7fbff;
padding:18px 20px;
border-radius:18px;
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
}
.role-grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
gap:14px;
margin-top:22px;
}
.role-card{
padding:16px;
border:2px solid #dbe7ff;
border-radius:16px;
text-align:center;
cursor:pointer;
font-weight:600;
}
.role-card.active{
background:#4d7eff;
border-color:#4d7eff;
color:#fff;
}
.custom-role input{
width:100%;
padding:14px;
border:1px solid #ddd;
border-radius:12px;
margin-top:18px;
}
.loading{
margin:30px 0;
font-weight:700;
text-align:center;
color:#4d7eff;
}
.error{
margin-top:18px;
background:#ffe5e5;
padding:13px;
border-radius:12px;
color:#d62828;
font-weight:600;
text-align:center;
}
.actions{
display:flex;
justify-content:space-between;
margin-top:34px;
}
.btn-next{
background:#4d7eff;
color:#fff;
border:none;
padding:13px 24px;
border-radius:10px;
}
`}</style>

      <div className="pc-step-content">
        <div className="resume-role-card">
          {!file && (
            <div className="upload-box" onClick={() => fileRef.current.click()}>
              <img src={file_img} className="upload-img" alt="" />
              <div className="upload-head">Upload Resume</div>
              <div className="upload-sub">Upload resume for AI parsing</div>
              <button className="upload-btn">Upload Resume →</button>
            </div>
          )}

          {file && (
            <>
              <div className="resume-top">
                <div>📄 {file.name}</div>
                <button className="btn-primary" onClick={changeResume}>Change Resume</button>
              </div>

              {loading ? (
                <div className="loading">
                  🤖 AI is analyzing your resume...
                  <br />
                  <small>This may take a few seconds</small>
                </div>
              ) : (
                <>
                  {suggestedRoles.length > 0 ? (
                    <>
                      <h3>
                        {error ? "Refined Role Suggestions" : "Select Role"}
                      </h3>

                      <div className="role-grid">
                        {suggestedRoles.map((role, i) => (
                          <div
                            key={i}
                            className={`role-card ${
                              selectedRole === role ? "active" : ""
                            }`}
                            onClick={() => {
                              setSelectedRole(role);
                              setRoleSkills([]);
                              validateRole(role); // 🔥 AUTO CALL
                            }}
                          >
                            {role}
                          </div>
                        ))}

                        <div
                          className={`role-card ${
                            selectedRole === "Other" ? "active" : ""
                          }`}
                          onClick={() => setSelectedRole("Other")}
                        >
                          + Other Role
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      ⚠️ No roles detected. Please enter manually.
                    </div>
                  )}

                  {selectedRole === "Other" && (
                    <div className="custom-role">
                      <input
                        value={customRole}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomRole(value);
                          setRoleSkills([]);

                          // clear previous timer
                          if (typingTimeout) {
                            clearTimeout(typingTimeout);
                          }

                          // 🔥 set new delay (user stop typing)
                          const timeout = setTimeout(() => {

                            const words = value.trim().split(" ");

                            // ✅ RULE: must be meaningful role
                            if (
                              value.length >= 6 &&         // avoid short words like "pyth"
                              words.length >= 1 &&         // at least 1 word
                              !value.endsWith(" ")         // avoid mid typing
                            ) {
                              validateRole(value);
                            }

                          }, 800); // ⏱️ wait 800ms after typing stops

                          setTypingTimeout(timeout);
                        }}
                        placeholder="Enter role"
                        disabled={roleLoading}
                      />
                      {roleLoading && (
                        <div style={{ fontSize: "12px", color: "#4d7eff", marginTop: "6px" }}>
                          🔍 Finding best matching role...
                        </div>
                      )}

                      <div style={{ fontSize: "12px", marginTop: "6px", color: "#666" }}>
                        💡 Try roles like "Frontend Developer", "Data Analyst"
                      </div>
                    </div>
                  )}
                  {roleSkills.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h4 style={{ color: "#4d7eff" }}>Suggested Skills</h4>

                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "10px"
                      }}>
                        {roleSkills.map((skill, i) => (
                          <span
                            key={i}
                            style={{
                              background: "#edf4ff",
                              padding: "8px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {error && (
            <div className="error">
              {error}
              <br />
              <button
                onClick={() => file && uploadResume(file)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#4d7eff",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          <input
            hidden
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <div className="review-actions">
            <button className="pc-back-btn" onClick={onBack}>Back</button>

            {file && !loading && roleSkills.length > 0 && (
              <button
                className="btn-next"
                onClick={handleContinue}
                disabled={roleLoading}
              >
                {roleLoading ? "Analyzing Role..." : "Continue →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StepResume;