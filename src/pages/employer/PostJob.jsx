import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { JdUploadSection } from "./components/post-job/JdUploadSection";
import { JdFormPopup } from "./components/post-job/JdFormPopup";
import { SuccessPopup } from "./components/post-job/SuccessPopup";

import {
  useIndustries,
  useParseJD,
  useCreateJob,
} from "@/hooks/employer/useEmployerJobs";

import "./empSubSections.css";
import "./PostJob.css";

export function PostJob({ editJobId = null }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  // New state for Job Title input during JD upload
  const [jdJobTitle, setJdJobTitle] = useState("");

  const [showJdPopup, setShowJdPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [customIndustry, setCustomIndustry] = useState("");

  // ================= REACT QUERY HOOKS =================
  const { data: rawIndustries } = useIndustries();
  const parseJdMutation = useParseJD();
  const createJobMutation = useCreateJob();

  // Format industries data
  let industryOptions = [];
  if (rawIndustries && Array.isArray(rawIndustries)) {
    industryOptions = rawIndustries.map((item) => {
      if (typeof item === "object") {
        return { label: item.label, value: item.value };
      }
      return {
        label: item,
        value: item === "Others" ? "other" : item,
      };
    });
    if (!industryOptions.find((i) => i.value === "other")) {
      industryOptions.push({ label: "Others", value: "other" });
    }
  } else {
    industryOptions = [
      {
        label: "IT / Software Development",
        value: "IT / Software Development",
      },
      {
        label: "Digital Marketing / SEO",
        value: "Digital Marketing / SEO",
      },
      { label: "UI / UX Design", value: "UI / UX Design" },
      { label: "Others", value: "other" },
    ];
  }

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
    if (!selectedFile) {
      toast.error("Select file first");
      return;
    }
    if (!jdJobTitle.trim()) {
      toast.error("Please enter the job title");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", jdJobTitle.trim());

      const res = await parseJdMutation.mutateAsync(formData);

      const rawData = res.data?.data || res.data || {};
      const data = rawData.parse_response?.flat || rawData.parsed_fields || {};

      let expReq = "";
      if (data.experience_min !== undefined && data.experience_min !== null && data.experience_max !== undefined && data.experience_max !== null) {
        expReq = `${data.experience_min}-${data.experience_max} years`;
      } else if (data.experience_min !== undefined && data.experience_min !== null) {
        expReq = `${data.experience_min} years`;
      } else if (data.experience_max !== undefined && data.experience_max !== null) {
        expReq = `Up to ${data.experience_max} years`;
      }

      let salRange = "";
      if (data.salary_min_lpa !== undefined && data.salary_min_lpa !== null && data.salary_max_lpa !== undefined && data.salary_max_lpa !== null) {
        salRange = `${data.salary_min_lpa} - ${data.salary_max_lpa} LPA`;
      } else if (data.salary_min_lpa !== undefined && data.salary_min_lpa !== null) {
        salRange = `${data.salary_min_lpa} LPA`;
      } else if (data.salary_max_lpa !== undefined && data.salary_max_lpa !== null) {
        salRange = `Up to ${data.salary_max_lpa} LPA`;
      }

      const skills = Array.isArray(data.required_skills) 
        ? data.required_skills.join(", ") 
        : (data.skills_text || "");

      setJobData({
        title: data.job_title || jdJobTitle.trim(),
        work_type: normalizeWorkType(data.work_mode),
        employment_type: data.employment_type || "Full-Time Employee",
        industry_type: normalizeIndustry(data.industry_type),

        must_have_skills: skills,
        salary_range: salRange,

        country: data.country || "",
        state: data.state || "",
        city: data.city || "",

        education: data.minimum_education || "",
        specialization: data.specialization || "",

        description: Array.isArray(data.responsibilities) ? data.responsibilities.join("\n") : (data.responsibilities || ""),
        job_description: data.job_description || "",

        experience_required: expReq,
        number_of_openings: data.number_of_openings || 1,
        application_deadline: normalizeDate(data.application_deadline),
      });

      setShowJdPopup(true);
      toast.success("JD Analyzed Successfully!");
    } catch (err) {
      console.error(err);
      const apiError = err?.response?.data?.message || err?.response?.data?.error || "JD parsing failed";
      toast.error(typeof apiError === "string" ? apiError : "JD parsing failed");
    }
  };

  const handlePostJob = async () => {
    try {
      if (!jobData.title || !jobData.description) {
        toast.error("Title & Description required");
        return;
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
          ? jobData.must_have_skills.split(",").map(s => s.trim())
          : [],

        responsibilities: jobData.description
          ? jobData.description.split("\n")
          : [],

        is_active: true,
      };

      const formData = new FormData();
      formData.append("title", jobData.title);
      formData.append("file", JSON.stringify(payload));
      
      // Attach JD File
      if (selectedFile) {
        formData.append("jd_file", selectedFile);
      }

      console.log("FINAL PAYLOAD FormData constructed:", payload);

      if (editJobId) {
        // We leave edit job for later if needed, but using createJobMutation for posting
        // If editJobId is passed, maybe it should be a useUpdateJob hook, but not specified in task
        toast.info("Edit Job not yet migrated to new hook");
      } else {
        await createJobMutation.mutateAsync(formData);
        toast.success("Job Created Successfully!");
      }

      setShowJdPopup(false);
      setShowSuccess(true);
      
      // Clear all states after successful posting
      setFileName("");
      setSelectedFile(null);
      setJdJobTitle("");
      setCustomIndustry("");
    } catch (error) {
      console.error(error.response?.data);
      
      let errorMsg = "Error posting job";
      const resData = error.response?.data;
      
      if (resData?.errors) {
        // Extract first error message from DRF errors object
        const firstKey = Object.keys(resData.errors)[0];
        if (firstKey) {
          const firstError = resData.errors[firstKey];
          errorMsg = `${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`;
        }
      } else if (resData?.message) {
        errorMsg = resData.message;
      }
      
      toast.error(errorMsg);
    }
  };

  return (
    <div className="emp-post-job-main">
      <div className="emp-post-job-content">
        <h2>Upload Your JD File!</h2>
        <p>
          Start discovering opportunities that match your skills and ambitions.
        </p>
      </div>

      <JdUploadSection
        fileName={fileName}
        jdJobTitle={jdJobTitle}
        setJdJobTitle={setJdJobTitle}
        handleClick={handleClick}
        handleJdUpload={handleJdUpload}
        isPending={parseJdMutation.isPending}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />

      {showJdPopup && (
        <JdFormPopup
          jobData={jobData}
          handleChange={handleChange}
          industryOptions={industryOptions}
          customIndustry={customIndustry}
          setCustomIndustry={setCustomIndustry}
          setShowJdPopup={setShowJdPopup}
          handlePostJob={handlePostJob}
          isPending={createJobMutation.isPending}
        />
      )}

      {showSuccess && (
        <SuccessPopup setShowSuccess={setShowSuccess} />
      )}
    </div>
  );
}
