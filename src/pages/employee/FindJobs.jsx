import { useState, useEffect } from "react";
import api from "@/services/api";
import slide1 from "@/assets/Carousel-1.jpg";
import slide2 from "@/assets/Carousel-2.jpg";
import slide3 from "@/assets/Carousel-3.jpg";

export function FindJobs() {
  const [Filter, setFilter] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState({
    experience: "",
    salary: "",
    location: "",
  });

  const [applying, setApplying] = useState(null);
  const [appliedJobsMap, setAppliedJobsMap] = useState({});

  const [activeIndex, setActiveIndex] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const slides = [
    {
      image: slide1,
    },
    {
      image: slide2,
    },
    {
      image: slide3,
    },
  ];

  const userName =
    storedUser?.first_name ||
    storedUser?.name ||
    storedUser?.username ||
    "User";

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchText, filters, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/v1/candidate_profile/");
        const data = res.data?.data || res.data;

        console.log("PROFILE:", data);

        setUserProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/user/v1/candidate_find_jobs/");

      let jobData = [];

      if (Array.isArray(res.data)) {
        jobData = res.data;
      } else if (res.data?.results) {
        jobData = res.data.results;
      } else if (res.data?.data?.results) {
        jobData = res.data.data.results;
      } else if (res.data?.data) {
        jobData = res.data.data;
      }

      setJobs(jobData);
      setFilteredJobs(jobData);
    } catch (error) {
      console.error(error);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/user/v1/candidate_jobs/");

      let appliedRaw = res.data?.data || res.data?.results || res.data || [];

      // ✅ Ensure it's always an array
      const applied = Array.isArray(appliedRaw)
        ? appliedRaw
        : appliedRaw
          ? [appliedRaw]
          : [];

      const statusMap = {};

      applied.forEach((item) => {
        if (!item) return;

        const id = item?.job?.id || item?.job_id || item?.job;

        if (!id) return;

        statusMap[String(id)] = item?.status || "Applied";
      });

      setAppliedJobsMap(statusMap);
    } catch (error) {
      console.error("Applied Jobs Error:", error);
    }
  };

  const applyFilters = () => {
    let temp = [...jobs];

    /* =============================
      ✅ SUGGESTED TAB (ROLE BASED)
    ============================== */
    if (activeTab === "suggested") {
      const role = userProfile?.job_preferences?.role?.toLowerCase();

      if (role) {
        temp = temp.filter((job) => {
          const title = job?.title?.toLowerCase() || "";
          const skills = Array.isArray(job?.skills_required)
            ? job.skills_required.join(" ").toLowerCase()
            : "";
          const jobRole = job?.role?.toLowerCase() || "";

          return (
            title.includes(role) ||
            skills.includes(role) ||
            jobRole.includes(role)
          );
        });
      }
    }

    /* =============================
      EXISTING FILTERS (UNCHANGED)
    ============================== */

    if (searchText) {
      temp = temp.filter(
        (job) =>
          job?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          getCompanyName(job).toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (filters.experience) {
      temp = temp.filter((job) =>
        String(job?.experience_required).includes(filters.experience),
      );
    }

    if (filters.salary) {
      temp = temp.filter(
        (job) => Number(job?.salary_range) >= Number(filters.salary),
      );
    }

    if (filters.location) {
      temp = temp.filter((job) =>
        job?.location?.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    setFilteredJobs(temp);
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(jobId);

      await api.post("/user/v1/candidate_jobs/", {
        job: jobId,
      });

      setAppliedJobsMap((prev) => ({
        ...prev,
        [String(jobId)]: "Applied",
      }));

      alert("Applied Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  const getLogo = (job) => {
    const logo =
      job?.employer?.kyc?.company_logo ||
      job?.employer?.company_logo ||
      job?.company_logo;

    if (!logo) return "https://via.placeholder.com/50";

    if (logo.startsWith("http")) return logo;

    return `http://127.0.0.1:8000/media/${logo}`;
  };

  const getCompanyName = (job) => {
    return job?.employer?.company_name || job?.company_name || "Company";
  };

  const isApplied = (jobId) => {
    return appliedJobsMap[String(jobId)] !== undefined;
  };

  return (
    <>
      {/* ================= STYLE ================= */}
      <style>{`

/* ===== MODAL OVERLAY ===== */
.job-modal-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.6);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:999;
}

/* ===== MODAL CARD ===== */
.job-modal-card{
  width:92%;
  max-width:700px;
  background:#fff;
  border-radius:20px;
  padding:24px;
  position:relative;
  max-height:90vh;
  overflow-y:auto;
  box-shadow:0 30px 80px rgba(0,0,0,.25);
  animation:fadeIn .25s ease;
}

@keyframes fadeIn{
  from{opacity:0;transform:scale(.95);}
  to{opacity:1;transform:scale(1);}
}

/* CLOSE */
.job-modal-close{
  position:absolute;
  right:16px;
  top:12px;
  font-size:22px;
  cursor:pointer;
  color:#666;
}

/* HEADER */
.job-modal-header{
  display:flex;
  gap:16px;
  align-items:center;
  padding-bottom:12px;
  border-bottom:1px solid #eee;
}

.job-modal-header img{
  width:65px;
  height:65px;
  border-radius:50%;
  border:2px solid #e6ecff;
}

.job-modal-header h3{
  margin:0;
  font-size:20px;
  color:#333;
}

.job-modal-header p{
  font-size:14px;
  color:#666;
  margin-top:4px;
}

/* META TAGS */
.job-modal-meta{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:14px;
}

.job-modal-meta span{
  background:#eef3ff;
  padding:6px 10px;
  border-radius:8px;
  font-size:12px;
  color:#555;
}

/* SECTION */
.job-section{
  margin-top:18px;
}

.job-section h4{
  font-size:15px;
  color:#4d7eff;
  margin-bottom:6px;
}

.job-section p{
  font-size:13px;
  color:#555;
  line-height:1.6;
}

/* SKILLS */
.job-skills-tags{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}

.job-skills-tags span{
  background:#f4f7ff;
  padding:6px 10px;
  border-radius:8px;
  font-size:12px;
}

/* APPLY BTN */
.apply-btn-main{
  width:100%;
  margin-top:20px;
  padding:12px;
  border:none;
  border-radius:12px;
  font-weight:600;
  font-size:15px;
  color:#fff;
  background:linear-gradient(135deg,#4d7eff,#6f9fff);
  cursor:pointer;
  transition:.2s;
}

.apply-btn-main:hover{
  opacity:.9;
}

/* MOBILE */
@media(max-width:768px){
  .job-modal-card{
    padding:18px;
  }

  .job-modal-header{
    flex-direction:column;
    align-items:flex-start;
  }

  .job-modal-header img{
    width:55px;
    height:55px;
  }
}

    `}</style>

      {/* ================= YOUR EXISTING UI ================= */}

      {/* HERO */}
      <div className="cd-welcome">
        <h3>Welcome {userName}!</h3>
        <p>
          Start discovering opportunities that match your skills and ambitions
        </p>
        <div className="cd-banner">
          {slides.map((item, index) => (
            <div
              key={index}
              className={`cd-slide ${index === activeIndex ? "active" : ""}`}
            >
              <img src={item.image} alt="" />
            </div>
          ))}

          <div className="cd-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="cd-search-row">
        <input
          placeholder="Search jobs..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button onClick={() => setFilter((prev) => !prev)}>
          <i className="bi bi-filter"></i>
          Filters
        </button>
      </div>

      {/* FILTERS */}
      {Filter && (
        <div className="filters-section">
          <div className="filters-box">
            <input
              className="filters-btn"
              placeholder="Experience"
              onChange={(e) =>
                setFilters({ ...filters, experience: e.target.value })
              }
            />

            <input
              className="filters-btn"
              placeholder="Min Salary"
              onChange={(e) =>
                setFilters({ ...filters, salary: e.target.value })
              }
            />

            <input
              className="filters-btn"
              placeholder="Location"
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="cd-job-tabs">
        <button
          className={`cd-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Jobs
        </button>

        <button
          className={`cd-tab ${activeTab === "suggested" ? "active" : ""}`}
          onClick={() => setActiveTab("suggested")}
        >
          Suggested
        </button>
      </div>

      {/* JOBS */}
      <div className="cd-job-list">
        {loading ? (
          <p>Loading...</p>
        ) : filteredJobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="cd-job-card">
              <img src={getLogo(job)} className="job-logo" alt="" />

              <div className="job-content">
                <div className="job-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">{getCompanyName(job)}</p>
                  </div>

                  <button
                    className="job-open-btn"
                    onClick={() => setSelectedJob(job)}
                  >
                    {isApplied(job.id) ? "Applied" : "Open"}
                  </button>
                </div>

                <div className="job-meta">
                  <span>{job.experience_required}</span>
                  <span>₹ {job.salary_range}</span>
                  <span>{job.location}</span>
                  <span>{job.employment_type}</span>
                  <span>{job.industry_type}</span>
                </div>

                <div className="job-skills">
                  {Array.isArray(job.skills_required)
                    ? job.skills_required.join(" · ")
                    : "No skills"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= ENHANCED MODAL ================= */}
      {selectedJob && (
        <div className="job-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="job-modal-card" onClick={(e) => e.stopPropagation()}>
            <span
              className="job-modal-close"
              onClick={() => setSelectedJob(null)}
            >
              ×
            </span>

            {/* HEADER */}
            <div className="job-modal-header">
              <img src={getLogo(selectedJob)} alt="" />
              <div>
                <h3>{selectedJob.title}</h3>
                <p>{getCompanyName(selectedJob)}</p>
              </div>
            </div>

            {/* META */}
            <div className="job-modal-meta">
              <span>{selectedJob.experience_required} Years</span>
              <span>₹ {selectedJob.salary_range}</span>
              <span>{selectedJob.location}</span>
              <span>{selectedJob.employment_type}</span>
              <span>{selectedJob.industry_type}</span>
            </div>

            {/* SKILLS */}
            <div className="job-section">
              <h4>Skills Required</h4>
              <div className="job-skills-tags">
                {Array.isArray(selectedJob.skills_required) &&
                  selectedJob.skills_required.map((skill, i) => (
                    <span key={i}>{skill}</span>
                  ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="job-section">
              <h4>Job Description</h4>
              <p>{selectedJob.description || "No description available"}</p>
            </div>

            {/* APPLY */}
            <button
              className="apply-btn-main"
              disabled={
                applying === selectedJob.id || isApplied(selectedJob.id)
              }
              onClick={() => handleApply(selectedJob.id)}
            >
              {applying === selectedJob.id
                ? "Applying..."
                : isApplied(selectedJob.id)
                  ? "Already Applied"
                  : "Apply Now"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
