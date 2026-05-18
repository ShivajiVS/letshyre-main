import { useEffect, useState } from "react";
import api from "../../services/api";

export function MyApplications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("applied");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ================= FETCH ================= */
  const fetchJobs = async () => {
    try {
      const res = await api.get("/user/v1/candidate_jobs/");

      const jobList =
        res.data?.data?.results ||
        res.data?.results ||
        (Array.isArray(res.data) ? res.data : []);

      const formattedJobs = jobList.map((item) => ({
        id: item.id,
        title: item.title || "N/A",
        company:
          item.company_name ||
          item?.employer?.company_name ||
          item?.employer?.name ||
          "N/A",
        experience: item.experience_required || "N/A",
        salary: item.salary_range || "Not disclosed",
        location: item.location || "N/A",
        type: item.employment_type || "Full Time",
        industry: item.industry_type || "N/A",
        skills: Array.isArray(item.skills_required)
          ? item.skills_required.join(" · ")
          : "N/A",
        description: item.description || "No description available",
        status: mapStatus(item.status),
        days: formatDays(item.created_at),
        logo: getLogo(item),
      }));

      setJobs(formattedJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const getLogo = (job) => {
    const logo =
      job?.company_logo ||
      job?.employer?.kyc?.company_logo ||
      job?.employer?.company_logo;

    if (!logo) return "https://via.placeholder.com/50";
    if (logo.startsWith("http")) return logo;

    return `http://127.0.0.1:8000/media/${logo}`;
  };

  const mapStatus = (status) => {
    if (!status) return "applied";

    const s = status.toLowerCase();

    if (s === "shortlisted") return "shortlisted";
    if (s === "selected" || s === "hired") return "selected";
    if (s === "rejected") return "rejected";

    return "applied";
  };

  const formatDays = (date) => {
    if (!date) return "";

    const diff = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  };

  /* ================= COUNTS ================= */
  const counts = {
    applied: jobs.filter((j) => j.status === "applied").length,
    shortlisted: jobs.filter((j) => j.status === "shortlisted").length,
    selected: jobs.filter((j) => j.status === "selected").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  const filteredJobs =
    activeFilter === "all"
      ? jobs
      : jobs.filter((j) => j.status === activeFilter);

  return (
  <div className="apps-wrapper">

    <style>{`

/* ================= WRAPPER ================= */
.apps-wrapper{
  padding:20px;
  background:linear-gradient(180deg,#f3f7ff,#eef4ff);
  min-height:100vh;
}

/* ================= HERO ================= */
.apps-hero{
  background:linear-gradient(135deg,#5c86ff,#8fb3ff);
  padding:26px;
  border-radius:22px;
  color:#fff;
  box-shadow:0 15px 40px rgba(0,0,0,.1);
  margin-bottom:14px;
}

.apps-hero h3{
  font-size:22px;
  font-weight:700;
}

.apps-hero p{
  opacity:.95;
  margin-top:6px;
  font-size:14px;
}

/* ================= SUMMARY ================= */
.apps-summary{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;
  margin-top:18px;
}

.apps-stat{
  background:rgba(255,255,255,.95);
  border-radius:16px;
  padding:16px;
  text-align:center;
  cursor:pointer;
  transition:.25s;
  color:#333;
}

.apps-stat:hover{
  transform:translateY(-3px);
}

.apps-stat h3{
  font-size:13px;
  font-weight:600;
}

.apps-stat h2{
  font-size:24px;
  margin:6px 0;
}

.apps-stat p{
  font-size:12px;
  color:#555;
}

.apps-stat.active{
  background:linear-gradient(135deg,#4d7eff,#6f9fff);
  color:#fff;
  box-shadow:0 10px 25px rgba(0,0,0,.2);
}

.apps-stat.active p,
.apps-stat.active h3{
  color:#fff;
}

/* ================= JOB LIST ================= */
.apps-job-list{
  margin-top:14px;
  display:flex;
  flex-direction:column;
  gap:14px;
}

/* ================= JOB CARD ================= */
.cd-job-card{
  display:flex;
  gap:16px;
  background:#fff;
  border-radius:18px;
  padding:18px;
  border:1px solid #dbe7ff;
  transition:.25s;
}

.cd-job-card:hover{
  transform:translateY(-4px);
  box-shadow:0 15px 35px rgba(0,0,0,.08);
}

/* LOGO */
.job-logo{
  width:60px;
  height:60px;
  border-radius:50%;
  border:2px solid #e0eaff;
  object-fit:cover;
}

/* CONTENT */
.job-content{
  flex:1;
}

.job-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

/* TITLE */
.job-title{
  font-size:18px;
  font-weight:600;
  color:#4d7eff;
}

.job-company{
  font-size:14px;
  color:#666;
  margin-top:2px;
}

/* BADGE */
.apps-badge{
  padding:6px 12px;
  border-radius:20px;
  font-size:12px;
  font-weight:600;
}

.apps-badge.applied{background:#e0ecff;color:#2563eb;}
.apps-badge.shortlisted{background:#fff3cd;color:#d97706;}
.apps-badge.selected{background:#dcfce7;color:#16a34a;}
.apps-badge.rejected{background:#ffe4e6;color:#dc2626;}

/* BUTTON */
.job-open-btn{
  background:linear-gradient(135deg,#4d7eff,#6f9fff);
  color:#fff;
  border:none;
  padding:8px 14px;
  border-radius:10px;
  cursor:pointer;
  font-weight:600;
  margin-left:8px;
}

/* META */
.job-meta{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  font-size:12px;
  margin-top:10px;
}

.job-meta span{
  background:#f4f7ff;
  padding:5px 8px;
  border-radius:8px;
}

/* DATE */
.cd-job-card small{
  margin-top:6px;
  display:block;
  font-size:12px;
  color:#777;
}

/* ================= MODAL ================= */
.job-modal-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.6);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:999;
}

.job-modal-card{
  width:92%;
  max-width:650px;
  background:#fff;
  border-radius:18px;
  padding:22px;
  max-height:90vh;
  overflow:auto;
  position:relative;
  animation:fadeIn .25s ease;
}

@keyframes fadeIn{
  from{opacity:0;transform:scale(.95);}
  to{opacity:1;transform:scale(1);}
}

.job-modal-close{
  position:absolute;
  right:14px;
  top:10px;
  font-size:22px;
  cursor:pointer;
}

/* MODAL HEADER */
.job-modal-header{
  display:flex;
  gap:14px;
  align-items:center;
  border-bottom:1px solid #eee;
  padding-bottom:10px;
}

.job-modal-header img{
  width:60px;
  height:60px;
  border-radius:50%;
}

.job-modal-header h3{
  margin:0;
}

.job-modal-meta{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:12px;
}

.job-modal-meta span{
  background:#eef3ff;
  padding:6px 10px;
  border-radius:8px;
  font-size:12px;
}

.job-section{
  margin-top:16px;
}

.job-section h4{
  color:#4d7eff;
  font-size:14px;
}

.job-skills-tags{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}

.job-skills-tags span{
  background:#f4f7ff;
  padding:5px 8px;
  border-radius:6px;
  font-size:12px;
}

/* ================= MOBILE ================= */
@media(max-width:768px){
  .apps-summary{grid-template-columns:repeat(2,1fr);}
  .cd-job-card{flex-direction:column;}
  .job-header{flex-direction:column;align-items:flex-start;}
  .job-open-btn{width:100%;margin-top:6px;}
}

@media(max-width:480px){
  .apps-summary{grid-template-columns:1fr;}
}

`}</style>

    {/* HERO */}
    <div className="apps-hero">
      <h3>Your Career Journey</h3>
      <p>Track applied, shortlisted, selected & rejected jobs</p>

      <div className="apps-summary">
        {["applied","shortlisted","selected","rejected"].map(type=>(
          <div key={type}
            className={`apps-stat ${activeFilter===type?"active":""}`}
            onClick={()=>setActiveFilter(type)}
          >
            <h3>{type.toUpperCase()}</h3>
            <h2>{counts[type]}</h2>
            <p>
              {type==="applied" && "Applications submitted"}
              {type==="shortlisted" && "Next stage"}
              {type==="selected" && "Final selection"}
              {type==="rejected" && "Not selected"}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* JOB LIST */}
    {loading ? (
      <p style={{textAlign:"center"}}>Loading...</p>
    ) : (
      <div className="apps-job-list">
        {filteredJobs.map(job=>(
          <div className="cd-job-card" key={job.id}>
            <img src={job.logo} className="job-logo" alt="" />

            <div className="job-content">
              <div className="job-header">
                <div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-company">{job.company}</div>
                </div>

                <div>
                  <span className={`apps-badge ${job.status}`}>
                    {job.status}
                  </span>
                  <button
                    className="job-open-btn"
                    onClick={()=>setSelectedJob(job)}
                  >
                    Open
                  </button>
                </div>
              </div>

              <div className="job-meta">
                <span>{job.experience}</span>
                <span>₹ {job.salary}</span>
                <span>{job.location}</span>
                <span>{job.type}</span>
                <span>{job.industry}</span>
              </div>

              <small>{job.days}</small>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* MODAL */}
    {selectedJob && (
      <div className="job-modal-overlay" onClick={()=>setSelectedJob(null)}>
        <div className="job-modal-card" onClick={(e)=>e.stopPropagation()}>

          <span className="job-modal-close" onClick={()=>setSelectedJob(null)}>×</span>

          <div className="job-modal-header">
            <img src={selectedJob.logo} alt="" />
            <div>
              <h3>{selectedJob.title}</h3>
              <p>{selectedJob.company}</p>
            </div>
          </div>

          <div className="job-modal-meta">
            <span>{selectedJob.experience}</span>
            <span>₹ {selectedJob.salary}</span>
            <span>{selectedJob.location}</span>
            <span>{selectedJob.type}</span>
            <span>{selectedJob.industry}</span>
          </div>

          <div className="job-section">
            <h4>Skills</h4>
            <div className="job-skills-tags">
              {selectedJob.skills !== "N/A"
                ? selectedJob.skills.split(" · ").map((s,i)=><span key={i}>{s}</span>)
                : <span>No skills</span>}
            </div>
          </div>

          <div className="job-section">
            <h4>Description</h4>
            <p>{selectedJob.description}</p>
          </div>

        </div>
      </div>
    )}

  </div>
);
}