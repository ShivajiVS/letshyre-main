import { useEffect, useState } from "react";
import user_pic from "@/assets/user-pic.jpeg";
import { candidateProfile } from "@/services/employee-profile.service";

export function EmployeeProfile() {
  const [profile, setProfile] = useState({
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    portfolio_links: [],
  });
  const [interviewScores, setInterviewScores] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ================= SAFE PARSE ================= */
  const parseField = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };
  /* ================= NOTICE ================= */
  const getNoticePeriod = (lastDate) => {
    if (!lastDate) return "N/A";

    const diff = Math.ceil(
      (new Date(lastDate) - new Date()) / (1000 * 60 * 60 * 24),
    );

    return diff <= 0 ? "Immediate Joiner" : `${diff} days`;
  };

  /* ================= INTERVIEW ================= */
  const processInterviewScores = (scores = []) => {
    const roleMap = {};

    scores.forEach((item) => {
      const role = item.job_role || "General";
      const score = parseInt(item.score?.toString().replace("%", "")) || 0;

      if (!roleMap[role] || score > roleMap[role].score) {
        roleMap[role] = { role, score };
      }
    });

    return Object.values(roleMap);
  };

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await candidateProfile();
        const p = res?.data?.data ?? res?.data ?? {};

        p.education = parseField(p.education);
        p.experience = parseField(p.experience);
        p.projects = parseField(p.projects);
        p.skills = parseField(p.skills);
        p.certifications = parseField(p.certifications);
        p.portfolio_links = parseField(p.portfolio_links);

        const interviews = parseField(p.interview_score);
        setInterviewScores(processInterviewScores(interviews));

        setProfile(p);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  /* ================= GAUGE ================= */
  const getStrokeOffset = (value) => {
    const radius = 80;
    const circumference = Math.PI * radius;
    return circumference - (value / 100) * circumference;
  };

  return (
    <div className="pp-wrapper">
      <style>{`

      .pp-wrapper{
        padding:20px;
        background:#f4f7ff;
      }

      /* HERO */
      .pp-hero{
        background:linear-gradient(135deg,#6f9fff,#9db8ff);
        border-radius:20px;
        padding:70px 20px 100px;
        position:relative;
      }

      .pp-actions{
        position:absolute;
        top:20px;
        right:20px;
        display:flex;
        gap:10px;
      }

      .pp-btn{
        padding:8px 14px;
        border-radius:10px;
        border:none;
        cursor:pointer;
        font-size:13px;
      }

      .edit{background:#000;color:#fff;}

      .pp-avatar{
        width:150px;
        height:150px;
        border-radius:50%;
        border:5px solid #fff;
        position:absolute;
        left:50%;
        transform:translateX(-50%);
        bottom:-75px;
        object-fit:cover;
      }

      /* CARD */
      .pp-card{
        background:#fff;
        padding:22px;
        border-radius:16px;
        margin-bottom:20px;
        box-shadow:0 6px 20px rgba(0,0,0,.05);
      }

      /* PERSONAL GRID */
      .pp-grid{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:14px;
        margin-top:10px;
      }

      .pp-item{
        display:flex;
        gap:8px;
        align-items:center;
        font-size:14px;
      }

      /* MAIN GRID */
      .pp-main{
        display:grid;
        grid-template-columns:2fr 1fr;
        gap:20px;
        margin-top:20px;
      }

      /* BLOCK */
      .pp-block{
        background:#f3f6ff;
        padding:14px;
        border-radius:12px;
        margin-bottom:12px;
      }

      .pp-title{
        color:#4d7eff;
        font-weight:600;
        margin-bottom:4px;
      }

      .pp-small{
        font-size:12px;
        color:#666;
      }

      /* SKILLS */
      .pp-skills{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }

      .pp-skills span{
        border:1px solid #4d7eff;
        padding:6px 12px;
        border-radius:20px;
        font-size:12px;
      }

      /* INTERVIEW GAUGE */
      .gauge{
        position:relative;
        width:200px;
        height:120px;
        margin:auto;
      }

      .gauge svg{
        width:100%;
        height:100%;
      }

      .gauge-text{
        position:absolute;
        bottom:10px;
        left:50%;
        transform:translateX(-50%);
        font-size:28px;
        font-weight:600;
        color:#4d7eff;
      }

      .carousel{
        display:flex;
        justify-content:space-between;
        margin-top:10px;
      }

      @media(max-width:768px){
        .pp-main{grid-template-columns:1fr;}
        .pp-grid{grid-template-columns:1fr;}
      }

      `}</style>

      {/* HERO */}
      <div className="pp-hero">
        <div className="pp-actions">
          <button className="pp-btn edit">Edit</button>
          <button className="pp-btn">Share</button>
        </div>

        <img src={profile.profile_photo || user_pic} className="pp-avatar" />
      </div>

      {/* PERSONAL */}
      <div className="pp-card" style={{ marginTop: "90px" }}>
        <h3>Personal Details</h3>

        <div className="pp-grid">
          <div className="pp-item">👤 {profile.name || "N/A"}</div>
          <div className="pp-item">📧 {profile.email || "N/A"}</div>
          <div className="pp-item">📞 {profile.phone_number || "N/A"}</div>
          <div className="pp-item">📅 {profile.dob || "N/A"}</div>
          <div className="pp-item">⚧ {profile.gender || "N/A"}</div>
          <div className="pp-item">📍 {profile.location || "N/A"}</div>
          <div className="pp-item">🏠 {profile.address || "N/A"}</div>
          <div className="pp-item">
            🏢 {profile.present_or_last_working_company || "N/A"}
          </div>
          <div className="pp-item">
            ✔ {profile.is_verified ? "Verified" : "Not Verified"}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="pp-main">
        {/* LEFT */}
        <div>
          <div className="pp-card">
            <h4>Work Experience</h4>
            {(profile.experience || []).map((e, i) => (
              <div key={i} className="pp-block">
                <div className="pp-title">{e.role}</div>
                <div>{e.company}</div>
                <div className="pp-small">{e.duration}</div>
                <div className="pp-small">{e.description}</div>
              </div>
            ))}
          </div>

          <div className="pp-card">
            <h4>Education</h4>

            {(profile.education || []).length === 0 ? (
              <p>No education data found</p>
            ) : (
              profile.education.map((e, i) => (
                <div key={i} className="pp-block">
                  <div className="pp-title">{e.degree}</div>

                  <div>{e.institution}</div>

                  <div className="pp-small">{e.duration}</div>
                </div>
              ))
            )}
          </div>

          <div className="pp-card">
            <h4>Projects</h4>
            {(profile.projects || []).map((p, i) => (
              <div key={i} className="pp-block">
                <div className="pp-title">{p.title}</div>
                <div>{p.description}</div>
                <div className="pp-small">{p.technologies?.join(", ")}</div>
              </div>
            ))}
          </div>

          <div className="pp-card">
            <h4>Certifications</h4>

            {(profile.certifications || []).length === 0 ? (
              <p>No certifications found</p>
            ) : (
              (profile.certifications || []).map((c, i) => (
                <div key={i} className="pp-block">
                  {c}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="pp-card">
            <h4>Interview Score</h4>

            {interviewScores.length ? (
              <>
                <p style={{ textAlign: "center", fontWeight: "600" }}>
                  {interviewScores[activeIndex].role}
                </p>

                <div className="gauge">
                  <svg viewBox="0 0 200 120">
                    <path
                      d="M20 100 A80 80 0 0 1 180 100"
                      stroke="#e0e7ff"
                      strokeWidth="15"
                      fill="none"
                    />

                    <path
                      d="M20 100 A80 80 0 0 1 180 100"
                      stroke="#4d7eff"
                      strokeWidth="15"
                      fill="none"
                      strokeDasharray={Math.PI * 80}
                      strokeDashoffset={getStrokeOffset(
                        interviewScores[activeIndex].score,
                      )}
                    />
                  </svg>

                  <div className="gauge-text">
                    {interviewScores[activeIndex].score}%
                  </div>
                </div>

                {interviewScores.length > 1 && (
                  <div className="carousel">
                    <button
                      onClick={() =>
                        setActiveIndex(
                          activeIndex === 0
                            ? interviewScores.length - 1
                            : activeIndex - 1,
                        )
                      }
                    >
                      ◀
                    </button>

                    <button
                      onClick={() =>
                        setActiveIndex(
                          (activeIndex + 1) % interviewScores.length,
                        )
                      }
                    >
                      ▶
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No Interviews Yet</p>
            )}
          </div>

          <div className="pp-card">
            <h4>Skills</h4>
            <div className="pp-skills">
              {(profile.skills || []).map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </div>

          <div className="pp-card">
            <h4>Salary</h4>₹ {profile.current_ctc} → ₹ {profile.expected_ctc}{" "}
            LPA
          </div>

          <div className="pp-card">
            <h4>Notice Period</h4>
            {getNoticePeriod(profile.last_day_of_working)}
          </div>

          <div className="pp-card">
            <h4>Documents</h4>
            {profile.resume ||
            profile.experience_letter ||
            profile.resignation_letter ? (
              <>
                {profile.resume && <a href={profile.resume}>Resume</a>}
                <br />
                {profile.experience_letter && (
                  <a href={profile.experience_letter}>Experience</a>
                )}
                <br />
                {profile.resignation_letter && (
                  <a href={profile.resignation_letter}>Resignation</a>
                )}
              </>
            ) : (
              <p>No documents found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
