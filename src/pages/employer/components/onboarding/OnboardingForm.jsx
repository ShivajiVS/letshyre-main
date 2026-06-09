import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employerOnboardingSchema,
  defaultValues,
} from "@/schemas/employer-onboarding-schema";
import {
  useSubmitOnboarding,
  useIndustriesList,
} from "@/hooks/employer/useEmployerOnboarding";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

// Subcomponents for Form
const FloatingInput = ({
  label,
  name,
  register,
  error,
  required,
  type = "text",
  tooltip,
  transformValue,
}) => {
  return (
    <div className="floating-input" title={tooltip}>
      <input
        type={type}
        {...register(name, {
          onChange: (e) => {
            if (transformValue) {
              e.target.value = transformValue(e.target.value);
            }
          },
        })}
        placeholder=" "
        className={error ? "has-error" : ""}
      />
      <label>
        {label} {required && <span className="required-asterisk">*</span>}
        {tooltip && <span className="tooltip-icon"> ⓘ</span>}
      </label>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

const FileUpload = ({ label, name, control, error, required, tooltip }) => {
  return (
    <div className="file-upload-container" title={tooltip}>
      <div className={`file-upload ${error ? "has-error" : ""}`}>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <span className="file-name-display">
                {value && value.type
                  ? value.type === "application/pdf"
                    ? "📄 "
                    : "🖼️ "
                  : ""}
                {value && value.name ? value.name : label}
                {required && !value && (
                  <span className="required-asterisk">*</span>
                )}
                {tooltip && !value && <span className="tooltip-icon"> ⓘ</span>}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                {value && (
                  <button
                    type="button"
                    className="clear-file-btn"
                    onClick={() => onChange(null)}
                    title="Remove file"
                  >
                    ✕
                  </button>
                )}
                <label className="e-upload-btn">
                  <p>{value ? "Replace" : "Select File"}</p>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    hidden
                  />
                </label>
              </div>
            </>
          )}
        />
      </div>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export const OnboardingForm = ({ onNextStep }) => {
  const [formStep, setFormStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: industries, isLoading: isLoadingIndustries } =
    useIndustriesList();
  const { mutate: submitOnboarding, isPending } = useSubmitOnboarding();

  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employerOnboardingSchema),
    defaultValues,
    mode: "onTouched", // Trigger validation immediately after field loses focus
  });

  // Watch all fields for draft saving
  const watchAllFields = watch();

  // Load draft & user data on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("employer_onboarding_draft");
    let initialData = { ...defaultValues };

    if (savedDraft) {
      try {
        initialData = { ...initialData, ...JSON.parse(savedDraft) };
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }

    // Prefill from user auth if available and not already set in draft
    if (user) {
      if (!initialData.official_email && user.email) {
        initialData.official_email = user.email;
      }
      if (!initialData.company_name && (user.name || user.first_name)) {
        initialData.company_name = user.name || user.first_name;
      }
    }

    reset(initialData);
  }, [reset, user]);

  // Save draft on changes (excluding files)
  useEffect(() => {
    // We only save text fields to draft. File objects cannot be serialized properly to localStorage
    const draftData = {
      company_name: watchAllFields.company_name,
      company_website: watchAllFields.company_website,
      company_registration_number: watchAllFields.company_registration_number,
      company_industry: watchAllFields.company_industry,
      gst_number: watchAllFields.gst_number,
      pan_number: watchAllFields.pan_number,
      company_description: watchAllFields.company_description,
      company_address: watchAllFields.company_address,
      official_email: watchAllFields.official_email,
    };

    // Check if any field has value before saving to avoid overwriting with empty defaults
    const hasData = Object.values(draftData).some((val) => val !== "");
    if (hasData) {
      localStorage.setItem(
        "employer_onboarding_draft",
        JSON.stringify(draftData),
      );
    }
  }, [
    watchAllFields.company_name,
    watchAllFields.company_website,
    watchAllFields.company_registration_number,
    watchAllFields.company_industry,
    watchAllFields.gst_number,
    watchAllFields.pan_number,
    watchAllFields.company_description,
    watchAllFields.company_address,
    watchAllFields.official_email,
  ]);

  const handleNextStep = async () => {
    // Validate Step 1 fields before proceeding to Step 2
    const isStep1Valid = await trigger([
      "company_name",
      "company_website",
      "company_registration_number",
      "company_industry",
      "gst_number",
      "pan_number",
      "company_description",
      "company_address",
      "official_email",
    ]);

    if (isStep1Valid) {
      setFormStep(2);
    }
  };

  const handleBackStep = () => {
    setFormStep(1);
  };

  const onSubmit = (data) => {
    // Construct FormData
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      // Ensure we don't append null files if they somehow bypass validation
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    submitOnboarding(formData, {
      onSuccess: () => {
        // Clear draft on success
        localStorage.removeItem("employer_onboarding_draft");

        // Show success animation
        setIsSuccess(true);
        setTimeout(() => {
          onNextStep();
        }, 1800);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Failed to submit KYC. Please try again.",
        );
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="success-animation-container">
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>
        <h3>Submission Successful!</h3>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <form className="form-scroll" onSubmit={handleSubmit(onSubmit)}>
      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className={`step ${formStep >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <span className="step-label">Company Details</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${formStep >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <span className="step-label">Legal Documents</span>
        </div>
      </div>

      {formStep === 1 && (
        <div className="onboard-grid">
          <FloatingInput
            label="Company Name"
            name="company_name"
            register={register}
            error={errors.company_name}
            required
          />

          <FloatingInput
            label="Company Website"
            name="company_website"
            register={register}
            error={errors.company_website}
            required
          />

          <FloatingInput
            label="Registration Number"
            name="company_registration_number"
            register={register}
            error={errors.company_registration_number}
            required
            tooltip="e.g. U72900TG2024PTC123456"
          />

          <div className="floating-input">
            {isLoadingIndustries ? (
              <div className="skeleton" style={{ height: "50px" }} />
            ) : (
              <select
                {...register("company_industry")}
                className={errors.company_industry ? "has-error" : ""}
                required
              >
                <option value="" disabled hidden></option>
                {industries.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            )}
            <label>
              Select Industry <span className="required-asterisk">*</span>
            </label>
            {errors.company_industry && (
              <span className="error-message">
                {errors.company_industry.message}
              </span>
            )}
          </div>

          <FloatingInput
            label="GST Number"
            name="gst_number"
            register={register}
            error={errors.gst_number}
            required
            transformValue={(v) => v.toUpperCase()}
          />

          <FloatingInput
            label="PAN Number"
            name="pan_number"
            register={register}
            error={errors.pan_number}
            required
            transformValue={(v) => v.toUpperCase()}
          />

          <div className="floating-input full">
            <textarea
              {...register("company_description")}
              placeholder=" "
              className={errors.company_description ? "has-error" : ""}
            ></textarea>
            <label>
              Company Description <span className="required-asterisk">*</span>
            </label>
            {errors.company_description && (
              <span className="error-message">
                {errors.company_description.message}
              </span>
            )}
          </div>

          <FloatingInput
            label="Company Address"
            name="company_address"
            register={register}
            error={errors.company_address}
            required
          />

          <FloatingInput
            label="Official Email"
            name="official_email"
            type="email"
            register={register}
            error={errors.official_email}
            required
          />

          <div
            className="full"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <button
              type="button"
              className="continue-btn"
              style={{ margin: 0 }}
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {formStep === 2 && (
        <div className="onboard-grid">
          <div className="full" style={{ marginBottom: "10px" }}>
            <h4
              style={{ color: "#4a5568", fontSize: "15px", fontWeight: "600" }}
            >
              Upload Documents (Max 5MB each)
            </h4>
            <p style={{ color: "#718096", fontSize: "13px", marginTop: "4px" }}>
              Please upload clear, legible copies of all required documents.
            </p>
          </div>

          <FileUpload
            label="Company Logo"
            name="company_logo"
            control={control}
            error={errors.company_logo}
            required
            tooltip="Square image recommended (PNG/JPG)"
          />

          <FileUpload
            label="Registration Cert"
            name="registration_certificate"
            control={control}
            error={errors.registration_certificate}
            required
            tooltip="Certificate of Incorporation"
          />

          <FileUpload
            label="GST Certificate"
            name="gst_certificate"
            control={control}
            error={errors.gst_certificate}
            required
            tooltip="Valid GST registration document"
          />

          <FileUpload
            label="Address Proof"
            name="address_proof"
            control={control}
            error={errors.address_proof}
            required
            tooltip="Utility bill or lease agreement"
          />

          {/* 
          <FileUpload
            label="Authorized ID Proof"
            name="authorized_id_proof"
            control={control}
            error={errors.authorized_id_proof}
            required
            tooltip="Aadhar, PAN, or Passport of authorized signatory"
          />

          <FileUpload
            label="Bank Proof"
            name="bank_proof"
            control={control}
            error={errors.bank_proof}
            required
            tooltip="Cancelled cheque or bank statement"
          />
          */}

          <div className="form-actions full">
            <button
              type="button"
              className="skip-btn back-btn"
              onClick={handleBackStep}
            >
              Back
            </button>
            <button
              type="submit"
              className="continue-btn submit-btn"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
