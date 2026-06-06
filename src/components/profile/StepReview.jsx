import { useState, useEffect, useMemo } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function StepReview({ onBack, onFinish, profileData = {} }) {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [resumeReview, setResumeReview] = useState({
    skills: [],
    certifications: [],
    education: [],
    projects: [],
    experience: [],
    total_experience: "",              // ✅ ADD
    role_wise_experience: [],          // ✅ ADD (CRITICAL)
  });

  console.log("PROFILE DATA:", profileData);

  /* ------------------------
Fallbacks
------------------------ */

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

  const jobId = profileData.job_id || null;

  const finalRoles = profileData.selected_role
    ? [profileData.selected_role]
    : profileData.suggested_roles?.length
    ? profileData.suggested_roles
    : [];

  /* ------------------------
Safe Photo
------------------------ */

  const [photoSrc, setPhotoSrc] = useState(null);

  useEffect(() => {
    if (!profilePhoto) {
      setPhotoSrc(null);
      return;
    }

    if (typeof profilePhoto === "string") {
      setPhotoSrc(profilePhoto);
      return;
    }

    const objectUrl = URL.createObjectURL(profilePhoto);
    setPhotoSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profilePhoto]);

useEffect(() => {}, [photoSrc, profilePhoto]);

  /* ------------------------
Use parsed data first
------------------------ */

  useEffect(() => {
    const parsed = profileData.parsed_resume_data;

    if (!parsed) return;

    // 🔥 HANDLE BOTH CASES (important)
    const finalParsed = parsed.data || parsed;

    setResumeReview({
      skills: finalParsed.skills || [],
      certifications: finalParsed.certifications || [],
      education: finalParsed.education || [],
      projects: finalParsed.projects || [],
      experience: finalParsed.experience || [],

      total_experience: finalParsed.total_experience || "",
      role_wise_experience: finalParsed.role_wise_experience || [],
    });
  }, [profileData.parsed_resume_data]);

  /* ------------------------
Resume Review API
POST not GET
------------------------ */

  

  /* ------------------------
Submit
------------------------ */

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const fd = new FormData();

      /* =========================
        IDENTITY
      ========================= */
      fd.append("gender", profileData.gender || "");
      fd.append("dob", profileData.dob || "");
      fd.append("aadhar_number", profileData.aadhar_number || "");
      fd.append("location", profileData.location || "");
      fd.append("address", profileData.address || "");

      if (profileData.profile_photo) {
        fd.append(
          "profile_photo",
          profileData.profile_photo,
          profileData.profile_photo.name || "profile_photo.png"
        );
      }

      /* =========================
        JOB DETAILS
      ========================= */
      fd.append(
        "present_or_last_working_company",
        profileData.present_or_last_working_company || ""
      );

      fd.append("last_day_of_working", profileData.last_day_of_working || "");
      fd.append("current_ctc", profileData.current_ctc || "");
      fd.append("expected_ctc", profileData.expected_ctc || "");
      fd.append("preferred_industry", profileData.preferred_industry || "");

      fd.append(
        "preferred_locations",
        JSON.stringify(profileData.preferred_locations || [])
      );

      if (profileData.resignation_letter) {
        fd.append("resignation_letter", profileData.resignation_letter);
      }

      if (profileData.experience_letter) {
        fd.append("experience_letter", profileData.experience_letter);
      }

      if (profileData.present_offer) {
        fd.append("present_offer", profileData.present_offer);
      }

      /* =========================
        RESUME
      ========================= */
      if (profileData.resume) {
        fd.append("resume", profileData.resume);
      }

      fd.append("resume_id", profileData.resume_id || "");
      fd.append("role", profileData.selected_role || "");
      fd.append("selected_role", profileData.selected_role || "");

      /* =========================
        🔥 CRITICAL FIX START
      ========================= */

      // Always send parsed data
      fd.append("parsed_resume_data", JSON.stringify(resumeReview || {}));

      // ✅ Education
      fd.append(
        "education",
        JSON.stringify(resumeReview.education || [])
      );

      // ✅ Experience
      fd.append(
        "experience",
        JSON.stringify(resumeReview.experience || [])
      );

      // ✅ Projects
      fd.append(
        "projects",
        JSON.stringify(resumeReview.projects || [])
      );

      // ✅ Certifications (optional but good)
      fd.append(
        "certifications",
        JSON.stringify(resumeReview.certifications || [])
      );

      // =========================
      // ✅ TOTAL EXPERIENCE (Years)
      // =========================
      let totalExpYears = 0;

      (resumeReview.experience || []).forEach((exp) => {
        if (!exp?.duration) return;

        // Example: "2 years 6 months"
        const yearMatch = exp.duration.match(/(\d+)\s*year/);
        const monthMatch = exp.duration.match(/(\d+)\s*month/);

        const years = yearMatch ? parseInt(yearMatch[1]) : 0;
        const months = monthMatch ? parseInt(monthMatch[1]) : 0;

        totalExpYears += years + months / 12;
      });

      fd.append(
        "total_experience_years",
        totalExpYears.toFixed(1) // e.g. 2.5
      );

      // =========================
      // ✅ TECH EXPERIENCE (ROLE-WISE JSON)
      // =========================
      const techExp = {};

      (resumeReview.experience || []).forEach((exp) => {
        if (!exp?.role) return;

        if (!techExp[exp.role]) {
          techExp[exp.role] = 0;
        }

        techExp[exp.role] += 1; // simple count
      });

      fd.append("tech_experience", JSON.stringify(techExp));

      /* =========================
        🔥 CRITICAL FIX END
      ========================= */

      fd.append("profile_completion_score", "100");
      fd.append("is_profile_complete", "true");

      /* =========================
        API CALL
      ========================= */
      const res = await fetch(`${BASE_URL}/user/v1/candidate_profile/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
          Accept: "application/json",
        },
        body: fd,
      });

      /* token expired */
      if (res.status === 401) {
        alert("Session expired. Login again.");
        localStorage.removeItem("user");
        window.location = "/login";
        return;
      }

      /* backend error */
      if (!res.ok) {
        const txt = await res.text();
        console.error("PROFILE SAVE ERROR:", txt);
        throw new Error("Profile save failed");
      }

      const result = await res.json();

      console.log("✅ PROFILE SAVED:", result);

      onFinish();
    } catch (e) {
      console.error("SUBMIT ERROR:", e);
      setError(e.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <style>{`

.review-container{
display:grid;
grid-template-columns:240px 1fr;
gap:18px;
margin-top:15px;
}

.review-left{
background:#f8fbff;
padding:24px 18px;
border-radius:22px;
text-align:center;
}

.review-avatar{
width:95px;
height:95px;
border-radius:50%;
object-fit:cover;
}

.review-right{
display:flex;
flex-direction:column;
gap:14px;
}

.review-card{
background:#fff;
padding:18px;
border-radius:18px;
box-shadow:
0 4px 14px rgba(0,0,0,.04);
}

.review-card h4{
color:#4d7eff;
margin-bottom:14px;
}

.grid-two{
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
}

.info-box{
background:#f7fbff;
padding:12px;
border-radius:10px;
}

.skill-tags{
display:flex;
flex-wrap:wrap;
gap:8px;
}

.skill-chip{
background:#edf4ff;
padding:7px 12px;
border-radius:30px;
font-size:12px;
font-weight:600;
}

.resume-box{
background:#eef4ff;
padding:12px;
border-radius:10px;
font-weight:600;
}

.edu-card,
.proj-card,
.exp-card{
background:#f9fbff;
padding:12px;
border-radius:10px;
margin-bottom:10px;
}

.loading-box{
text-align:center;
font-weight:600;
color:#4d7eff;
}

.error-msg{
background:#ffe6e6;
padding:11px;
border-radius:10px;
color:#d62828;
font-weight:600;
}

.review-actions{
display:flex;
justify-content:space-between;
margin-top:8px;
}

.btn-primary{
background:#4d7eff;
color:#fff;
border:none;
padding:12px 22px;
border-radius:10px;
}

@media(max-width:900px){
.review-container{
grid-template-columns:1fr;
}
.grid-two{
grid-template-columns:1fr;
}
}
.highlight-box{
  background:linear-gradient(135deg,#4d7eff,#6fa3ff);
  color:#fff;
}

.highlight-box b{
  color:#fff;
}

.role-exp-card{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px;
  background:#f5f9ff;
  border-radius:12px;
  margin-bottom:8px;
}

.role-exp-title{
  font-weight:600;
}

.role-exp-value{
  color:#4d7eff;
  font-weight:700;
}

.review-card{
  transition:all .2s ease;
}

.review-card:hover{
  transform:translateY(-2px);
  box-shadow:0 8px 20px rgba(0,0,0,.08);
}
`}</style>

      <div className="review-container">
        <div className="review-left">
          {photoSrc ? (
            <img src={photoSrc} className="review-avatar" />
          ) : (
            <div className="review-avatar" />
          )}

          <h3>{user?.name || "Candidate"}</h3>

          <p>{gender}</p>
          <p>{dob}</p>
          <p>{location}</p>
          <p>Aadhaar Verified</p>
        </div>

        <div className="review-right">
          <div className="review-card">
            <h4>Profile Summary</h4>

            <div className="grid-two">
              <div className="info-box">
                <b>Company</b>
                <br />
                {company}
              </div>

              <div className="info-box">
                <b>Last Working Day</b>
                <br />
                {lastWorking}
              </div>

              <div className="info-box">
                <b>Current CTC</b>
                <br />
                {currentCtc} LPA
              </div>

              <div className="info-box">
                <b>Expected CTC</b>
                <br />
                {expectedCtc} LPA
              </div>

              <div className="info-box">
                <b>Industry</b>
                <br />
                {industry}
              </div>

              <div className="info-box">
                <b>Locations</b>
                <br />
                {locations}
              </div>
            </div>
          </div>

          <div className="review-card">
            <h4>Selected Roles</h4>

            <div className="skill-tags">
              {finalRoles.map((r, i) => (
                <span key={i} className="skill-chip">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="review-card">
            <h4>Resume</h4>

            <div className="resume-box">
              📄 {resume?.name || "Uploaded Resume"}
            </div>
          </div>

            <>
              <div className="review-card">
                <h4>Skills</h4>
                <div className="skill-tags">
                  {(resumeReview.skills || []).map((s, i) => (
                    <span key={i} className="skill-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="review-card">
                <h4>Certifications</h4>
                {(resumeReview.certifications || []).map((c, i) => (
                  <div key={i} className="edu-card">
                    {typeof c === "string" ? c : JSON.stringify(c)}
                  </div>
                ))}
              </div>

              <div className="review-card">
                <h4>Education</h4>

                {resumeReview.education.length === 0 ? (
                  <div className="edu-card">No education data found</div>
                ) : (
                  (resumeReview.education || []).map((e, i) => (
                    <div key={i} className="edu-card">
                      {typeof e === "string" ? (
                        e
                      ) : (
                        <>
                          {/* Degree */}
                          <h5>{e.degree || "N/A"}</h5>

                          {/* Institution */}
                          <div>{e.institution || "N/A"}</div>

                          {/* Duration */}
                          <div>{e.duration || ""}</div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="review-card">
                <h4>Projects</h4>
                {(resumeReview.projects || []).map((p, i) => (
                  <div key={i} className="proj-card">
                    {typeof p === "string" ? (
                      p
                    ) : (
                      <>
                        <h5>{p.title}</h5>
                        <p>{p.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="review-card">
                <h4>Experience</h4>
                {(resumeReview.experience || []).map((e, i) => (
                  <div key={i} className="exp-card">
                    {typeof e === "string" ? (
                      e
                    ) : (
                      <>
                        <h5>{e.role}</h5>
                        <div>{e.company}</div>
                        <div>{e.duration}</div>
                        <p>{e.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="review-card">
                <h4>Role-wise Experience</h4>

                {resumeReview.role_wise_experience?.length === 0 ? (
                  <div className="edu-card">No role-wise experience found</div>
                ) : (
                  (resumeReview.role_wise_experience || []).map((item, i) => (
                    <div key={i} className="role-exp-card">
                      <div className="role-exp-title">{item.role}</div>
                      <div className="role-exp-value">{item.experience}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          

          {error && <div className="error-msg">{error}</div>}

          <div className="review-actions">
            <button className="pc-back-btn" onClick={onBack}>
              Back
            </button>

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm & Finish →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StepReview;
