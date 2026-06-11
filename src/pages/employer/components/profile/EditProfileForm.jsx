import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employerProfileSchema } from "@/schemas/employer/employerProfileSchema";
import img03 from "@/assets/emp-profile03.png";
import api from "@/services/api";

function FieldError({ message }) {
  if (!message) return null;
  return <span className="field-error">{message}</span>;
}

export const EditProfileForm = ({
  profile,
  kyc,
  onCancel,
  updateKycMutation,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(employerProfileSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      location: "",
      companySize: "",
      industry: "",
      linkedinUrl: "",
      companyDescription: "",
      companyLogo: undefined,
    },
  });

  useEffect(() => {
    reset({
      email: kyc?.official_email || profile?.email || "",
      location: kyc?.company_address || profile?.location || "",

      companySize: kyc?.company_size || "",
      industry: kyc?.company_industry || "",
      linkedinUrl: kyc?.linkedin_url || "",

      companyDescription: kyc?.company_description || "",
    });
  }, [profile, kyc, reset]);

  const hasError = (field) => !!errors[field];
  const companyLogoFiles = watch("companyLogo");
  const logoFileName = companyLogoFiles?.[0]?.name;

  const getExistingFileName = (url) => {
    if (!url) return "Company Logo";
    try {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      return lastPart.split('?')[0] || "Company Logo";
    } catch (e) {
      return "Company Logo";
    }
  };
  const displayFileName = logoFileName || (kyc?.company_logo ? getExistingFileName(kyc.company_logo) : "Company Logo");

  const [logoPreview, setLogoPreview] = useState(kyc?.company_logo || null);

  useEffect(() => {
    if (companyLogoFiles && companyLogoFiles[0]) {
      const file = companyLogoFiles[0];
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoPreview(kyc?.company_logo || null);
    }
  }, [companyLogoFiles, kyc?.company_logo]);

  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await api.get("/user/v1/industries/list/");
        if (res.data?.success && res.data?.data) {
          setIndustries(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch industries:", err);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (industries.length > 0 && kyc?.company_industry) {
      const match = industries.find(
        (ind) =>
          ind.value === kyc?.company_industry ||
          ind.label === kyc?.company_industry ||
          ind.value.includes(kyc?.company_industry) || 
          kyc?.company_industry.includes(ind.value)
      );
      if (match) {
        setValue("industry", match.value);
      } else {
        setValue("industry", kyc.company_industry);
      }
    }
  }, [industries, kyc, setValue]);

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = async () => {
    const isStep1Valid = await trigger([
      "email",
      "location",
      "companySize",
      "industry",
      "linkedinUrl",
    ]);
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("company_size", data.companySize);
    formData.append("company_industry", data.industry);
    formData.append("company_description", data.companyDescription);
    formData.append("company_address", data.location);
    formData.append("linkedin_url", data.linkedinUrl);
    formData.append("official_email", data.email);

    if (data.companyLogo && data.companyLogo[0]) {
      formData.append("company_logo", data.companyLogo[0]);
    }

    updateKycMutation.mutate(formData, {
      onSuccess: () => {
        onCancel();
      },
    });
  };

  return (
    <div className="edit-profile-container" style={{ position: "relative" }}>
      <button 
        onClick={onCancel} 
        style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b", zIndex: 10 }}
        aria-label="Close"
      >
        <i className="bi bi-x-lg" style={{ fontSize: "1.2rem" }}></i>
      </button>
      
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
              {currentStep === 1 && (
                <>
                  <div className="full-width" style={{ marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--ep-text-main)" }}>Step 1: Basic Details</h3>
                  </div>

                  {/* Row 1 */}
              <div
                className={`form-group ${hasError("email") ? "has-error" : ""}`}
              >
                <label>Official Email</label>
                <div className="input-with-icon">
                  <i className="bi bi-envelope"></i>
                  <input
                    type="email"
                    placeholder="example@company.com"
                    {...register("email")}
                  />
                </div>
                <FieldError
                  message={errors.email?.message}
                />
              </div>



              {/* Row 3 */}
              <div
                className={`form-group ${hasError("location") ? "has-error" : ""}`}
              >
                <label>Location</label>
                <div className="input-with-icon">
                  <i className="bi bi-geo-alt"></i>
                  <input
                    type="text"
                    placeholder="Enter location"
                    {...register("location")}
                  />
                </div>
                <FieldError
                  message={errors.location?.message}
                />
              </div>



              <div
                className={`form-group ${hasError("companySize") ? "has-error" : ""}`}
              >
                <label>Company Size</label>
                <div className="input-with-icon">
                  <i className="bi bi-people"></i>
                  <select {...register("companySize")}>
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="500+">500+ Employees</option>
                  </select>
                </div>
                <FieldError
                  message={errors.companySize?.message}
                />
              </div>

              {/* Row 5 */}
              <div
                className={`form-group ${hasError("industry") ? "has-error" : ""}`}
              >
                <label>Industry</label>
                <div className="input-with-icon">
                  <i className="bi bi-briefcase"></i>
                  <select {...register("industry")}>
                    <option value="">Select Industry</option>
                    {industries.map((ind) => (
                      <option key={ind.value} value={ind.value}>
                        {ind.label}
                      </option>
                    ))}
                  </select>
                </div>
                <FieldError
                  message={errors.industry?.message}
                />
              </div>

              <div
                className={`form-group ${hasError("linkedinUrl") ? "has-error" : ""}`}
              >
                <label>LinkedIn URL</label>
                <div className="input-with-icon">
                  <i className="bi bi-linkedin"></i>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/..."
                    {...register("linkedinUrl")}
                  />
                </div>
                <FieldError
                  message={errors.linkedinUrl?.message}
                />
              </div>

              {/* Action Buttons */}
              <div className="form-actions full-width">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-save"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="full-width" style={{ marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", color: "var(--ep-text-main)" }}>Step 2: Company Info & Logo</h3>
              </div>
              <div
                className={`form-group full-width ${hasError("companyDescription") ? "has-error" : ""}`}
              >
                <label>Company Description</label>
                <textarea
                  rows="4"
                  placeholder="Briefly describe your company..."
                  {...register("companyDescription")}
                />
                <FieldError
                  message={errors.companyDescription?.message}
                />
              </div>

              {/* Full Width Row - Upload Logo */}
              <div
                className={`form-group full-width ${hasError("companyLogo") ? "has-error" : ""}`}
              >
                <label>Company Logo</label>
                <div className="upload-box">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg,.webp"
                    id="companyLogoUpload"
                    className="hidden-file-input"
                    {...register("companyLogo")}
                  />
                  <label htmlFor="companyLogoUpload" className="upload-label">
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", width: "100%", justifyContent: "center" }}>
                         <div style={{ 
                           width: "80px", 
                           height: "80px", 
                           borderRadius: "12px", 
                           border: "1px solid var(--ep-border-color)", 
                           background: "white",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           overflow: "hidden",
                           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                           flexShrink: 0
                         }}>
                           {logoPreview ? (
                             <img 
                               src={logoPreview} 
                               alt="Logo preview" 
                               style={{ width: "100%", height: "100%", objectFit: "contain", padding: "0.5rem" }} 
                             />
                           ) : (
                             <i className="bi bi-image" style={{ fontSize: "2rem", color: "#cbd5e1" }}></i>
                           )}
                         </div>
                         <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.3rem", textAlign: "left" }}>
                           <span style={{ fontSize: "0.95rem", color: "var(--ep-text-main)", fontWeight: "600", wordBreak: "break-all" }}>
                             {logoPreview ? displayFileName : "No Logo Uploaded"}
                           </span>
                           <span style={{ fontSize: "0.85rem", color: "var(--ep-primary-color)", fontWeight: "500" }}>
                             <i className="bi bi-cloud-upload" style={{ marginRight: "0.4rem" }}></i> 
                             {logoPreview ? "Upload New Logo" : "Upload Logo"}
                           </span>
                           <span style={{ fontSize: "0.75rem", color: "var(--ep-text-muted)" }}>
                             JPG, PNG or SVG. Max size 5MB.
                           </span>
                         </div>
                      </div>
                  </label>
                </div>
                <FieldError
                  message={errors.companyLogo?.message}
                />
              </div>

              {/* Action Buttons */}
              <div className="form-actions full-width">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setCurrentStep(1)}
                  disabled={isSubmitting || updateKycMutation.isPending}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={isSubmitting || updateKycMutation.isPending}
                >
                  {updateKycMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
            </form>
          </div>
        </div>
      </div>
  );
};
