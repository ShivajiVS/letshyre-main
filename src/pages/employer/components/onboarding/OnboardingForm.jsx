import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employerOnboardingSchema, defaultValues } from "./schema";
import { useSubmitOnboarding, useIndustriesList } from "@/hooks/employer/useEmployerOnboarding";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on typical LetsHyre setup

// Subcomponents for Form
const FloatingInput = ({ label, name, register, error, required, type = "text" }) => {
  return (
    <div className="floating-input">
      <input
        type={type}
        {...register(name)}
        placeholder=" "
        className={error ? "has-error" : ""}
      />
      <label>
        {label} {required && <span className="required-asterisk">*</span>}
      </label>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

const FileUpload = ({ label, name, control, error, required }) => {
  return (
    <div className="file-upload-container">
      <div className={`file-upload ${error ? "has-error" : ""}`}>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <span>
                {value && value.name ? value.name : label}
                {required && <span className="required-asterisk">*</span>}
              </span>
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
            </>
          )}
        />
      </div>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export const OnboardingForm = ({ onNextStep }) => {
  const [formStep, setFormStep] = React.useState(1);
  const { data: industries, isLoading: isLoadingIndustries } = useIndustriesList();
  const { mutate: submitOnboarding, isPending } = useSubmitOnboarding();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employerOnboardingSchema),
    defaultValues,
  });

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
      formData.append(key, data[key]);
    });

    submitOnboarding(formData, {
      onSuccess: () => {
        toast.success("Employer KYC submitted successfully!");
        onNextStep();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to submit KYC. Please try again.");
      },
    });
  };

  return (
    <form className="form-scroll" onSubmit={handleSubmit(onSubmit)}>
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
          />

          <div className="floating-input">
            {isLoadingIndustries ? (
              <div className="skeleton" style={{ height: "50px" }} />
            ) : (
              <select
                {...register("company_industry")}
                className={errors.company_industry ? "has-error" : ""}
              >
                <option value="">Select Industry *</option>
                {industries.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            )}
            {errors.company_industry && (
              <span className="error-message">{errors.company_industry.message}</span>
            )}
          </div>

          <FloatingInput
            label="GST Number"
            name="gst_number"
            register={register}
            error={errors.gst_number}
            required
          />

          <FloatingInput
            label="PAN Number"
            name="pan_number"
            register={register}
            error={errors.pan_number}
            required
          />

          <div className="floating-input full">
            <textarea
              {...register("company_description")}
              placeholder="Company Description *"
              className={errors.company_description ? "has-error" : ""}
            ></textarea>
            {errors.company_description && (
              <span className="error-message">{errors.company_description.message}</span>
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

          <div className="full" style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", marginBottom: "20px" }}>
            <button
              type="button"
              className="continue-btn"
              style={{ margin: 0 }}
              onClick={handleNextStep}
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {formStep === 2 && (
        <div className="onboard-grid">
          <div className="full" style={{ marginBottom: "10px" }}>
            <h4 style={{ color: "#4a5568", fontSize: "15px", fontWeight: "600" }}>
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
          />

          <FileUpload
            label="Registration Cert"
            name="registration_certificate"
            control={control}
            error={errors.registration_certificate}
            required
          />

          <FileUpload
            label="GST Certificate"
            name="gst_certificate"
            control={control}
            error={errors.gst_certificate}
            required
          />

          <FileUpload
            label="Address Proof"
            name="address_proof"
            control={control}
            error={errors.address_proof}
            required
          />

          <FileUpload
            label="Authorized ID Proof"
            name="authorized_id_proof"
            control={control}
            error={errors.authorized_id_proof}
            required
          />

          <FileUpload
            label="Bank Proof"
            name="bank_proof"
            control={control}
            error={errors.bank_proof}
            required
          />

          <div className="form-actions full">
            <button
              type="button"
              className="skip-btn back-btn"
              onClick={handleBackStep}
            >
              Back
            </button>
            <button type="submit" className="continue-btn submit-btn" disabled={isPending}>
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
