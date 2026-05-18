import React, { useRef, useState, useEffect } from "react";
import api from "@/services/api";
import axios from "axios";
import { useNavigate } from "react-router";
import upload_img from "@/assets/dragNdrop.png";
import overlay_img from "@/assets/JD-Upload.png";
import check_mark from "@/assets/check-mark.png";
import party from "@/assets/party.png";

import "./empSubSections.css";

export function PostJob({ editJobId = null }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showJdPopup, setShowJdPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [industryOptions, setIndustryOptions] = useState([]);
  const [customIndustry, setCustomIndustry] = useState("");

  const AI_BASE_URL = "https://api.letshyre.com";

  // ================= FETCH INDUSTRIES =================
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await api.get("/user/v1/industries/list/");
        const industries = res.data?.data || [];

        let formatted = industries.map((item) => {
          if (typeof item === "object") {
            return { label: item.label, value: item.value };
          }
          return {
            label: item,
            value: item === "Others" ? "other" : item,
          };
        });

        if (!formatted.find((i) => i.value === "other")) {
          formatted.push({ label: "Others", value: "other" });
        }

        setIndustryOptions(formatted);
      } catch (err) {
        console.error("Industry API failed, using fallback");

        setIndustryOptions([
          { label: "IT / Software Development", value: "IT / Software Development" },
          { label: "Digital Marketing / SEO", value: "Digital Marketing / SEO" },
          { label: "UI / UX Design", value: "UI / UX Design" },
          { label: "Others", value: "other" },
        ]);
      }
    };

    fetchIndustries();
  }, []);

  // ================= HELPERS =================
  const normalizeWorkType = (mode) => {
    if (!mode) return "Hybrid";
    if (mode.toLowerCase().includes("remote")) return "Remote";
    if (mode.toLowerCase().includes("site")) return "On-site";
    if (mode.toLowerCase().includes("hybrid")) return "Hybrid";
    return "Hybrid";
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
      return dateStr;
    }
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return "";
  };

  const normalizeIndustry = (industry) => {
    if (!industry) return "";

    const lower = industry.toLowerCase();

    if (lower.includes("it")) return "IT / Software Development";
    if (lower.includes("marketing")) return "Digital Marketing / SEO";
    if (lower.includes("design")) return "UI / UX Design";

    return "other";
  };

  // ================= STATE =================
  const [jobData, setJobData] = useState({
    title: "",
    work_type: "Hybrid",
    employment_type: "Full-Time Employee",
    industry_type: "",

    must_have_skills: "",
    salary_range: "",

    country: "",
    state: "",
    city: "",

    education: "",
    specialization: "",

    description: "",
    job_description: "",

    experience_required: "",
    number_of_openings: "",
    application_deadline: "",
  });

  const handleChange = (field, value) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  // ================= JD PARSING =================
  const handleJdUpload = async () => {
    if (!selectedFile) return alert("Select file first");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await api.post(
        "/user/v1/employer_job_jd_ai/parse/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ FIXED PATH
      const data = res.data?.data?.parse_response?.flat || {};

      setJobData((prev) => ({
        ...prev,
        title: data.job_title || "",

        country: data.country || "",
        state: data.state || "",
        city: data.city || "",

        must_have_skills: data.skills_text || "",

        education: data.minimum_education || "",
        specialization: data.specialization || "",

        job_description: data.job_description || "",
        description: (data.responsibilities || []).join("\n"),

        work_type: normalizeWorkType(data.work_mode),

        experience_required:
          data.experience_min && data.experience_max
            ? `${data.experience_min}-${data.experience_max} years`
            : "",

        // ✅ FIXED FIELDS
        salary_range:
          data.salary_min_lpa && data.salary_max_lpa
            ? `${data.salary_min_lpa} - ${data.salary_max_lpa} LPA`
            : "",

        number_of_openings: data.number_of_openings || 1,

        industry_type: normalizeIndustry(data.industry_type),

        application_deadline: normalizeDate(data.application_deadline),
      }));

      setShowJdPopup(true);
    } catch (err) {
      console.error(err);
      alert("JD parsing failed");
    }
  };

  // ================= POST JOB =================
  const handlePostJob = async () => {
    try {
      if (!jobData.title || !jobData.description) {
        return alert("Title & Description required");
      }

      const payload = {
        title: jobData.title,
        description: jobData.description,

        country: jobData.country,
        state: jobData.state,
        city: jobData.city,

        work_mode:
          jobData.work_type === "Hybrid"
            ? "hybrid"
            : jobData.work_type === "Remote"
            ? "remote"
            : "on_site",

        employment_type:
          jobData.employment_type === "Full-Time Employee"
            ? "full_time"
            : "part_time",

        industry_type:
          jobData.industry_type === "other"
            ? customIndustry || "other"
            : jobData.industry_type,

        salary_range: jobData.salary_range,
        experience_required: jobData.experience_required,
        education_required: jobData.education,
        specialization: jobData.specialization,
        number_of_openings: Number(jobData.number_of_openings) || 1,
        deadline: jobData.application_deadline || null,

        skills_required: jobData.must_have_skills
          ? jobData.must_have_skills.split(",").map((s) => s.trim())
          : [],

        responsibilities: jobData.description
          ? jobData.description.split("\n")
          : [],

        is_active: true,
      };

      console.log("FINAL PAYLOAD:", payload);

      if (editJobId) {
        await api.patch(`/user/v1/employer_job_detail/${editJobId}/`, payload);
      } else {
        await api.post("/user/v1/employer_jobs/", payload);
      }

      setShowJdPopup(false);
      setShowSuccess(true);
    } catch (error) {
      console.error(error.response?.data);
      alert("Error posting job");
    }
  };

  return (
    <div className="emp-post-job-main">
      <div className="emp-post-job-content">
        <h2>Upload Your JD File!</h2>
        <p>Start discovering opportunities that match your skills and ambitions.</p>
      </div>

      <div className="emp-post-job-upload">
        <img src={upload_img} onClick={handleClick} alt="Upload" style={{ cursor: "pointer" }} />

        {fileName ? (
          <>
            <p className="file-name">{fileName}</p>
            <button className="emp-upload-btn02" onClick={handleClick}>Replace File</button>
            <button className="emp-upload-btn" onClick={handleJdUpload}>Upload</button>
          </>
        ) : (
          <>
            <h3>Drag & Drop your file here</h3>
            <p>or</p>
            <button className="emp-upload-btn" onClick={handleClick}>Choose File</button>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>

      {showJdPopup && (
        <div className="jd-overlay">
          <div className="jd-card-main">
            <h2 className="jd-heading">Role Ready!</h2>

            <div className="jd-card">
              <div className="jd-left">
                <img className="jd-upload-img" src={overlay_img} alt="" />
                <h4>Verify Your Job Details</h4>
                <p>
                  Our AI has parsed your JD. Review everything before posting.
                </p>
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
                      onChange={(e) =>
                        handleChange("work_type", e.target.value)
                      }
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
                      <option value="Full-Time Employee">
                        Full-Time Employee
                      </option>
                      <option value="Part-Time Employee">
                        Part-Time Employee
                      </option>
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
                      onChange={(e) =>
                        handleChange("salary_range", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange("education", e.target.value)
                      }
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
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
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

                  <button className="jd-post-btn" onClick={handlePostJob}>
                    Post Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

       {showSuccess && (
        <div className="emp-overlay emp-success-overlay">
          <div className="emp-success-popup">
            <img src={party} className="emp-party" alt="" />
            <img src={check_mark} alt="" className="emp-success-icon" />
            <h2 className="emp-blue-text">Job Posted Successfully 🎉</h2>
            <button
              className="emp-btn emp-btn-black"
              onClick={() => {
                setShowSuccess(false);
                navigate("/employer/view-jobs");
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
