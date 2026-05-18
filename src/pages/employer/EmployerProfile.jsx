import React, { useState, useEffect } from "react";
import api from "@/services/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import img01 from "@/assets/emp-profile.png";
import img02 from "@/assets/emp-profile02.png";
import img03 from "@/assets/emp-profile03.png";
import img04 from "@/assets/emp-profile04.png";
import img05 from "@/assets/emp-profile05.png";

import "./EmployerProfile.css";

// ── Zod Schema ──────────────────────────────────────────────
const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be under 50 characters"),

  role: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(50, "Role must be under 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  location: z.string().min(1, "Please select a location"),

  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be under 100 characters"),

  companyWebsite: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(val),
      "Enter a valid URL (e.g. example.com or https://example.com)",
    ),

  companySize: z.string().min(1, "Please select a company size"),

  industry: z.string().min(1, "Please select an industry"),

  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .regex(/linkedin\.com/, "Must be a LinkedIn URL")
    .optional()
    .or(z.literal("")),

  registrationNumber: z.string().min(1, "Registration number is required"),

  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN (e.g. ABCDE1234F)")
    .optional()
    .or(z.literal("")),

  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid 15-digit GST number",
    )
    .optional()
    .or(z.literal("")),

  companyDescription: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .or(z.literal("")),

  companyLogo: z
  .any()
  .optional()
  .refine(
    (files) =>
      !files ||
      files.length === 0 ||
      files[0].size <= 2 * 1024 * 1024,
    "File size must be under 2MB"
  )
  .refine(
    (files) =>
      !files ||
      files.length === 0 ||
      ["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(
        files[0].type
      ),
    "Only JPG, PNG, SVG or WEBP allowed"
  ),

});

// ── Error message component
function FieldError({ message, touched }) {
  if (!message || !touched) return null;
  return <span className="field-error">{message}</span>;
}

export function EmployerProfile() {

  const [editProfile, setEditProfile] = useState(false);

  // ✅ Profile + KYC
  const [profile, setProfile] = useState(null);
  const [kyc, setKyc] = useState(null);

  // ✅ Logged user
  const [loggedUser, setLoggedUser] = useState(null);

  // ✅ Stats
  const [stats, setStats] = useState({
    jobs: 0,
    matches: 0,
    hired: 0,
  });

  /* ================= FETCH ALL ================= */
  useEffect(() => {
    fetchProfile();
    fetchStats();
    getLoggedUser();
  }, []);

  /* ================= PROFILE + KYC ================= */
  const fetchProfile = async () => {
  try {
    const profileRes = await api.get("/user/v1/employer_profile/");
    const profileData = profileRes.data?.data || profileRes.data || {};
    console.log("PROFILE API:", profileData);

    setProfile(profileData);

    const kycRes = await api.get("/user/v1/employer_kyc/");
    const kycData = kycRes.data?.data || kycRes.data || {};
    console.log("KYC API:", kycData);

    setKyc(kycData);

  } catch (err) {
    console.error("API Error:", err);
  }
};

  /* ================= STATS ================= */
  const fetchStats = async () => {
    try {
      const jobRes = await api.get("/user/v1/employer_jobs/");
      const jobs = jobRes.data.data || jobRes.data || [];

      const jobsCount = jobs.length;

      let totalMatches = 0;
      let totalHired = 0;

      for (let job of jobs) {
        const res = await api.get(
          `/user/v1/employer_candidate_job_management/${job.id}/`
        );

        const raw = res.data.data || res.data;

        const candidates = Array.isArray(raw)
          ? raw
          : raw.results || [];

          totalMatches += candidates.length;

          totalHired += candidates.filter(
          (c) => c.application_status === "Hired"
        ).length;
    }

      setStats({
        jobs: jobsCount,
        matches: totalMatches,
        hired: totalHired,
      });

    } catch (err) {
      console.error("Stats API Error:", err);
    }
  };

  /* ================= LOGGED USER ================= */
  const getLoggedUser = () => {
    const user = localStorage.getItem("user");

    if (user) {
      setLoggedUser(JSON.parse(user));
    }
  };

  /* ================= HELPER ================= */
  const val = (field) => {
    if (field === null || field === undefined || field === "") {
      return "NA";
    }
    return field;
  };

  /* ================= FORM ================= */
  const {
  register,
  handleSubmit,
  watch,
  reset,
  formState: { errors, isSubmitting, touchedFields },
} = useForm({
  resolver: zodResolver(profileSchema),
  mode: "onTouched",
  defaultValues: {
    fullName: "",
    role: "",
    email: "",
    mobileNumber: "",
    location: "",
    companyName: "",
    companyWebsite: "",
    companySize: "",
    industry: "",
    linkedinUrl: "",
    registrationNumber: "",
    panNumber: "",
    gstNumber: "",
    companyDescription: "",
    companyLogo: undefined,
  },
});

/* ================= AUTO PREFILL ================= */
useEffect(() => {
  if (!editProfile) return;

  console.log("Prefill Triggered");

  reset({
    fullName: profile?.name || profile?.full_name || profile?.full_name || "",
    role: profile?.role || "",
    email: profile?.email || "",
    mobileNumber: profile?.phone_number || profile?.phone || profile?.phone || "",
    location: profile?.location || "",

    companyName: kyc?.company_name || "",
    companyWebsite: kyc?.company_website || kyc?.website_url || "",
    companySize: kyc?.company_size || "",
    industry: kyc?.company_industry || "",
    linkedinUrl: kyc?.linkedin_url || "",

    registrationNumber: kyc?.company_registration_number || "",
    panNumber: kyc?.pan_number || "",
    gstNumber: kyc?.gst_number || "",

    companyDescription: kyc?.company_description || "",
  });

}, [editProfile, profile, kyc]);



  // Only show error styling after the user has touched the field
  const hasError = (field) => !!errors[field] && !!touchedFields[field];

  // Show selected filename inside the Company Logo box
  const companyLogoFiles = watch("companyLogo");
  const logoFileName = companyLogoFiles?.[0]?.name;

  const onSubmit = async (data) => {
  try {
    console.log("FORM DATA:", data);

    /* ================= PROFILE UPDATE ================= */
    await api.patch("/user/v1/employer_profile/", {
  name: data.fullName,
  full_name: data.fullName, // fallback
  role: data.role,
  email: data.email,
  phone_number: data.mobileNumber,
  phone: data.mobileNumber, // fallback
  location: data.location,
});

    /* ================= KYC UPDATE ================= */
    const formData = new FormData();

    formData.append("company_name", data.companyName);
    formData.append("company_website", data.companyWebsite);
    formData.append("company_size", data.companySize);
    formData.append("company_industry", data.industry);
    formData.append("linkedin_url", data.linkedinUrl);

    formData.append("company_registration_number", data.registrationNumber);
    formData.append("pan_number", data.panNumber);
    formData.append("gst_number", data.gstNumber);
    formData.append("company_description", data.companyDescription);

    // ✅ Logo upload (ONLY if user selected)
    if (data.companyLogo && data.companyLogo[0]) {
      formData.append("company_logo", data.companyLogo[0]);
    }

    await api.patch("/user/v1/employer_kyc/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Profile updated successfully ✅");

    setEditProfile(false);

    // Refresh UI
    fetchProfile();

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    alert("Update failed ❌");
  }
};

  return (
    <main className="ep-page">
      {/* Top Banner */}
      <section className="ep-banner" aria-label="Profile banner">
        <div className="ep-banner-left">
          <img
            src={img01}
            alt="Profile illustration with decorative elements"
            className="ep-banner-side-image ep-left-image"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="ep-banner-content">
          <h2 className="ep-banner-title">{val(kyc?.company_name || loggedUser?.company_name)}</h2>
          <p className="ep-banner-subtitle">
            Review and manage your organization's core details, branding, and
            contact information.
          </p>

          <button
            className="ep-edit-btn"
            aria-label="Edit profile information"
            onClick={() => {
              setEditProfile(true);
              console.log("clicked...");
            }}
          >
            Edit Profile
          </button>

          <div className="ep-cpb-stats">
            <div className="ep-cpb-stat">
              <span className="ep-cpb-stat-num">{stats.jobs}+</span>
              <span className="ep-cpb-stat-label">Jobs Posted</span>
            </div>
            <div className="ep-cpb-stat">
              <span className="ep-cpb-stat-num">{stats.matches}+</span>
              <span className="ep-cpb-stat-label">Matches</span>
            </div>
            <div className="ep-cpb-stat">
              <span className="ep-cpb-stat-num">{stats.hired}+</span>
              <span className="ep-cpb-stat-label">Already Hired</span>
            </div>
          </div>

        </div>

        <div className="ep-banner-right">
          <img
            src={img02}
            alt="Decorative polygon shape"
            className="ep-banner-side-image ep-right-image"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </section>

      {/* Primary Details */}
      <section className="ep-card" aria-labelledby="primary-details-heading">
        <h3 id="primary-details-heading" className="ep-heading">
          Primary Details
        </h3>
        <div className="ep-grid">
          <div className="ep-grid-col">
            <div className="ep-grid-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ep-icon"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <div>{val(profile?.name || profile?.full_name || loggedUser?.name)}</div>
            </div>
            <div className="ep-grid-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ep-icon"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
              <div>{val(kyc?.company_industry)}</div>
            </div>
          </div>

          <div className="ep-grid-col">
            <div className="ep-grid-item">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="ep-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 6l10 7 10-7" />
              </svg>
              <div>{val(profile?.email || loggedUser?.email)}</div>
            </div>
            <div className="ep-grid-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ep-icon"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <div>{val(profile?.phone_number || profile?.phone || loggedUser?.phone_number)}</div>
            </div>
            
          </div>

          <div className="ep-grid-col">
            
            <div className="ep-grid-item">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="ep-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 6l10 7 10-7" />
              </svg>
              <div>{val(kyc?.official_email || loggedUser?.official_email)}</div>
            </div>
            <div className="ep-grid-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ep-icon"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <div>{val(kyc?.company_address)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Cards */}
      <div className="ep-bottom-grid">
        <div className="ep-info-card ep-company-card">
          <div className="ep-info-card-content">
            <h3 className="ep-heading">Company Details</h3>
            <div className="ep-grid-col ep-compact">
              <div className="ep-grid-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="ep-icon"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
                <p>{val(kyc?.company_name)}</p>
              </div>
              <div className="ep-grid-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ep-icon"
                  aria-hidden="true"
                >
                  <rect x="4" y="4" width="16" height="10" rx="2" />
                  <path d="M2 18h20" />
                </svg>
                <p>{val(kyc?.company_website || kyc?.website_url)}</p>
              </div>
              <div className="ep-grid-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ep-icon"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="4" />
                  <line x1="8" y1="11" x2="8" y2="16" />
                  <circle cx="8" cy="8" r="1" />
                  <path d="M12 16v-3a2 2 0 0 1 4 0v3" />
                </svg>
                <p>{val(kyc?.linkedin_url)}</p>
              </div>
            </div>
          </div>
          <div className="ep-info-card-illustration ep-company-illustration">
            <img
              src={img04}
              alt="Company building illustration showing office architecture"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>

        <div className="ep-info-card ep-more-card">
          <div className="ep-info-card-content">
            <h3 className="ep-heading">Few More</h3>
            <div className="ep-more-details">
              <p>
                <strong className="ep-highlight">Reg. No. :</strong>{" "}
                {val(kyc?.company_registration_number)}
              </p>
              <p>
                <strong className="ep-highlight">GST No. :</strong> {val(kyc?.gst_number)}
              </p>
              <p>
                <strong className="ep-highlight">PAN No. :</strong> {val(kyc?.pan_number)}
              </p>
            </div>
          </div>
          <div className="ep-info-card-illustration ep-more-illustration">
            <img
              src={img05}
              alt="Document illustration showing registration papers"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>

      {editProfile && (
        <div className="ep-edit-overlay">
          {/* <div className="ep-main-container"> */}
          {/* <img src={brand} alt="Letshyre" className="brand-image" /> */}

          <div className="edit-profile-shell">
            <button
              className="emp-edit-back"
              onClick={() => setEditProfile(false)}
            >
              <i className="bi bi-arrow-left-short"></i> <span>Back</span>
            </button>
            <div className="edit-profile-container">
              <div className="left-panel">
                <img
                  src={img03}
                  alt="Profile illustration"
                  className="left-panel-image"
                />
              </div>

              <div className="right-panel">
                <h2 className="edit-title">Edit Your Profile</h2>

                <div className="form-scroll">
                  <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
                    {/* ── Row 1 ── */}
                    <div
                      className={`form-group ${hasError("fullName") ? "has-error" : ""}`}
                    >
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Anoop Rubens"
                        {...register("fullName")}
                      />
                      <FieldError
                        message={errors.fullName?.message}
                        touched={touchedFields.fullName}
                      />
                    </div>

                    <div
                      className={`form-group ${hasError("role") ? "has-error" : ""}`}
                    >
                      <label>Role</label>
                      <input
                        type="text"
                        placeholder="Frontend Developer"
                        {...register("role")}
                      />
                      <FieldError
                        message={errors.role?.message}
                        touched={touchedFields.role}
                      />
                    </div>

                    <div
                      className={`form-group ${hasError("email") ? "has-error" : ""}`}
                    >
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="swarna123@gmail.com"
                        {...register("email")}
                      />
                      <FieldError
                        message={errors.email?.message}
                        touched={touchedFields.email}
                      />
                    </div>

                    {/* ── Row 2 ── */}
                    <div
                      className={`form-group ${hasError("mobileNumber") ? "has-error" : ""}`}
                    >
                      <label>Mobile Number</label>
                      <input
                        type="text"
                        placeholder="9999999999"
                        {...register("mobileNumber")}
                      />
                      <FieldError
                        message={errors.mobileNumber?.message}
                        touched={touchedFields.mobileNumber}
                      />
                    </div>

                    <div
                      className={`form-group ${hasError("location") ? "has-error" : ""}`}
                    >
                      <label>Location</label>
                      <select {...register("location")}>
                        <option value="">Select location</option>
                        <option value="Bangalore, India">
                          Bangalore, India
                        </option>
                        <option value="Mumbai, India">Mumbai, India</option>
                        <option value="Delhi, India">Delhi, India</option>
                        <option value="Hyderabad, India">
                          Hyderabad, India
                        </option>
                        <option value="Chennai, India">Chennai, India</option>
                        <option value="Pune, India">Pune, India</option>
                      </select>
                      <FieldError
                        message={errors.location?.message}
                        touched={touchedFields.location}
                      />
                    </div>

                    <div
                      className={`form-group ${hasError("companyName") ? "has-error" : ""}`}
                    >
                      <label>Company Name</label>
                      <input
                        type="text"
                        placeholder="Step Up Mark..."
                        {...register("companyName")}
                      />
                      <FieldError
                        message={errors.companyName?.message}
                        touched={touchedFields.companyName}
                      />
                    </div>

                    {/* ── Row 3 ── */}
                    <div
                      className={`form-group ${hasError("companyWebsite") ? "has-error" : ""}`}
                    >
                      <label>Company Website</label>
                      <input
                        type="text"
                        placeholder="https://stepupmark.ai"
                        {...register("companyWebsite")}
                      />
                      <FieldError
                        message={errors.companyWebsite?.message}
                        touched={touchedFields.companyWebsite}
                      />
                    </div>

                    <div
                      className={`form-group ${hasError("companySize") ? "has-error" : ""}`}
                    >
                      <label>Company Size</label>
                      <select {...register("companySize")}>
                        <option value="">Select size</option>
                        <option value="1-10">1–10 employees</option>
                        <option value="11-50">11–50 employees</option>
                        <option value="51-200">51–200 employees</option>
                        <option value="201-500">201–500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                      <FieldError
                        message={errors.companySize?.message}
                        touched={touchedFields.companySize}
                      />
                    </div>

                    <div
                      className={`form-group ${hasError("industry") ? "has-error" : ""}`}
                    >
                      <label>Industry</label>
                      <select {...register("industry")}>
                        <option value="">Select industry</option>
                        <option value="IT/Service Based">
                          IT / Service Based
                        </option>
                        <option value="Product">Product</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Other">Other</option>
                      </select>
                      <FieldError
                        message={errors.industry?.message}
                        touched={touchedFields.industry}
                      />
                    </div>

                    {/* ── Row 4 ── */}
                    <div
                      className={`form-group ${hasError("linkedinUrl") ? "has-error" : ""}`}
                    >
                      <label>LinkedIn URL</label>
                      <input
                        type="text"
                        placeholder="https://linkedin.com/in/..."
                        {...register("linkedinUrl")}
                      />
                      <FieldError
                        message={errors.linkedinUrl?.message}
                        touched={touchedFields.linkedinUrl}
                      />
                    </div>

                    <div
                      className={`form-group required ${hasError("registrationNumber") ? "has-error" : ""}`}
                    >
                      <label>Registration Number</label>
                      <input
                        type="text"
                        placeholder="CIN / REG number"
                        {...register("registrationNumber")}
                      />
                      <FieldError
                        message={errors.registrationNumber?.message}
                        touched={touchedFields.registrationNumber}
                      />
                    </div>

                    <div
                      className={`form-group ${hasError("panNumber") ? "has-error" : ""}`}
                    >
                      <label>PAN Number</label>
                      <input
                        type="text"
                        placeholder="ABCDE1234F"
                        {...register("panNumber")}
                      />
                      <FieldError
                        message={errors.panNumber?.message}
                        touched={touchedFields.panNumber}
                      />
                    </div>

                    {/* ── Row 5 ── */}
                    <div
                      className={`form-group ${hasError("gstNumber") ? "has-error" : ""}`}
                    >
                      <label>GST Number</label>
                      <input
                        type="text"
                        placeholder="22AAAAA0000A1Z5"
                        {...register("gstNumber")}
                      />
                      <FieldError
                        message={errors.gstNumber?.message}
                        touched={touchedFields.gstNumber}
                      />
                    </div>

                    <div
                      className={`form-group form-group-wide ${hasError("companyDescription") ? "has-error" : ""}`}
                    >
                      <label>Company Description</label>
                      <input
                        type="text"
                        placeholder="Our Company aims to produce something that..."
                        {...register("companyDescription")}
                      />
                      <FieldError
                        message={errors.companyDescription?.message}
                        touched={touchedFields.companyDescription}
                      />
                    </div>

                    {/* ── Row 6 — Company Logo ── */}
                    <div
                      className={`form-group required ${hasError("companyLogo") ? "has-error" : ""}`}
                    >
                      <div
                        className={`file-box ${hasError("companyLogo") ? "file-box-error" : ""}`}
                      >
                        <span className="file-name-preview">
                          {logoFileName ?? ""}
                        </span>
                        <label className="file-btn" htmlFor="companyLogo">
                          Company Logo
                        </label>
                        <input
                          id="companyLogo"
                          type="file"
                          accept="image/jpeg,image/png,image/svg+xml,image/webp"
                          style={{ display: "none" }}
                          {...register("companyLogo")}
                        />
                      </div>
                      <FieldError
                        message={errors.companyLogo?.message}
                        touched={touchedFields.companyLogo}
                      />
                    </div>

                    <div className="form-group" />

                    {/* ── Confirm button ── */}
                    <div className="form-group form-group-full">
                      <button
                        type="submit"
                        className="confirm-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Confirm"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
