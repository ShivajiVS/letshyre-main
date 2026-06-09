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
import { motion, AnimatePresence } from "framer-motion";

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
  value,
  onBlurModifier,
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
          onBlur: (e) => {
            if (onBlurModifier) onBlurModifier(e.target.value);
          }
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

const FileUpload = ({ label, name, control, error, required, tooltip, onPreview }) => {
  // Helper to format file size
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="file-upload-container">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          // Object URL for image preview (cleanup handled by browser on unmount/re-render but better to do it properly in a real app, though for this simple form it's fine)
          const previewUrl = value && value.type?.startsWith("image/") ? URL.createObjectURL(value) : null;

          return (
            <div className={`file-upload-box ${error ? "has-error" : ""} ${value ? "is-success" : ""}`}>
              <div className="file-info-section">
                {/* Visual Icon / Thumbnail */}
                <div 
                  className="file-icon-area" 
                  onClick={() => previewUrl && onPreview && onPreview(previewUrl)}
                  style={{ cursor: previewUrl ? 'pointer' : 'default' }}
                  title={previewUrl ? "Click to view larger" : ""}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="file-thumbnail" />
                  ) : value && value.type === "application/pdf" ? (
                    <span className="file-emoji-icon">📄</span>
                  ) : (
                    <span className="file-emoji-icon">📁</span>
                  )}
                </div>

                <div className="file-details">
                  <span className="file-name-display">
                    {value ? (
                      <span className="uploaded-name" title={value.name}>
                        {value.name}
                        <span className="file-size">({formatBytes(value.size)})</span>
                        <span className="success-check">✅</span>
                      </span>
                    ) : (
                      <span className="file-label-text">
                        {label} {required && <span className="required-asterisk">*</span>}
                      </span>
                    )}
                  </span>
                  
                  {/* Tooltip moved to subtext for mobile friendliness */}
                  {!value && tooltip && (
                    <span className="file-subtext">{tooltip}</span>
                  )}
                </div>
              </div>

              <div className="file-actions">
                {value && (
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => onChange(null)}
                    title="Remove file"
                  >
                    Remove
                  </button>
                )}
                <label className={`file-btn ${value ? 'replace-btn' : 'upload-btn'}`}>
                  {value ? "Replace" : "Select File"}
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    accept=".jpg,.jpeg,.png,.pdf,.webp"
                    hidden
                  />
                </label>
              </div>
            </div>
          );
        }}
      />
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

  const [isShaking, setIsShaking] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [previewModalImage, setPreviewModalImage] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(employerOnboardingSchema),
    defaultValues,
    mode: "onTouched", // Trigger validation immediately after field loses focus
  });

  // Watch all fields for draft saving
  const watchAllFields = watch();

  // Unsaved changes browser warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

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
      setSaveStatus("saved");
      const timeout = setTimeout(() => setSaveStatus(null), 2000);
      return () => clearTimeout(timeout);
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
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
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
    <form className={`form-scroll ${isShaking ? "shake-animation" : ""}`} onSubmit={handleSubmit(onSubmit, () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    })}>
      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div 
          className={`step ${formStep >= 1 ? "active" : ""}`} 
          onClick={() => formStep === 2 && handleBackStep()}
          style={{ cursor: formStep === 2 ? 'pointer' : 'default' }}
        >
          <div className="step-number">1</div>
          <span className="step-label">Company Details</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${formStep >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <span className="step-label">Legal Documents</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {formStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="onboard-grid"
          >
          <FloatingInput
            label="Company Name"
            name="company_name"
            register={register}
            error={errors.company_name}
            value={watchAllFields.company_name}
            required
          />

          <FloatingInput
            label="Company Website"
            name="company_website"
            register={register}
            error={errors.company_website}
            value={watchAllFields.company_website}
            required
            onBlurModifier={(val) => {
              if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
                setValue("company_website", "https://" + val, { shouldValidate: true });
              }
            }}
          />

          <FloatingInput
            label="Registration Number"
            name="company_registration_number"
            register={register}
            error={errors.company_registration_number}
            value={watchAllFields.company_registration_number}
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
            value={watchAllFields.gst_number}
            required
            transformValue={(v) => v.toUpperCase()}
          />

          <FloatingInput
            label="PAN Number"
            name="pan_number"
            register={register}
            error={errors.pan_number}
            value={watchAllFields.pan_number}
            required
            transformValue={(v) => v.toUpperCase()}
          />

          <div className="floating-input full">
            <textarea
              {...register("company_description")}
              placeholder=" "
              className={errors.company_description ? "has-error" : ""}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              style={{ overflow: 'hidden', minHeight: '60px', resize: 'none' }}
            ></textarea>
            <label>
              Company Description <span className="required-asterisk">*</span>
            </label>
            <span className="character-counter">
              {watchAllFields.company_description?.length || 0} / 500
            </span>
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
            value={watchAllFields.company_address}
            required
          />

          <FloatingInput
            label="Official Email"
            name="official_email"
            type="email"
            register={register}
            error={errors.official_email}
            value={watchAllFields.official_email}
            required
          />

          <div
            className="full"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "20px",
              marginBottom: "20px",
              gap: "16px"
            }}
          >
            {saveStatus === "saved" && (
              <span className="draft-saved-text">Draft saved ✓</span>
            )}
            <button
              type="button"
              className="continue-btn"
              style={{ margin: 0 }}
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
          </motion.div>
        )}

        {formStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="onboard-grid step-2"
          >
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
            onPreview={setPreviewModalImage}
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
            onPreview={setPreviewModalImage}
          />
          */}

          <div
            className="full"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              gap: "16px",
            }}
          >
            <button
              type="button"
              className="skip-btn back-btn"
              onClick={handleBackStep}
            >
              Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              {saveStatus === "saved" && (
                <span className="draft-saved-text" style={{ marginLeft: 'auto' }}>Draft saved ✓</span>
              )}
              <button
                type="submit"
                className="continue-btn submit-btn"
                disabled={isPending}
                style={{ marginLeft: saveStatus !== "saved" ? 'auto' : '0' }}
              >
                {isPending ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  "Submit & Complete"
                )}
              </button>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      {previewModalImage && (
        <div className="image-preview-modal" onClick={() => setPreviewModalImage(null)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-preview-btn" onClick={() => setPreviewModalImage(null)}>✕</button>
            <img src={previewModalImage} alt="Large preview" />
          </div>
        </div>
      )}
    </form>
  );
};
