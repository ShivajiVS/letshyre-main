import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employerProfileSchema } from "@/schemas/employer/employerProfileSchema";
import img03 from "@/assets/emp-profile03.png";

function FieldError({ message, touched }) {
  if (!message || !touched) return null;
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
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(employerProfileSchema),
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

  useEffect(() => {
    reset({
      fullName: profile?.name || profile?.full_name || "",
      role: profile?.role || "",
      email: profile?.email || "",
      mobileNumber: profile?.phone_number || profile?.phone || "",
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
  }, [profile, kyc, reset]);

  const hasError = (field) => !!errors[field] && !!touchedFields[field];
  const companyLogoFiles = watch("companyLogo");
  const logoFileName = companyLogoFiles?.[0]?.name;

  const onSubmit = async (data) => {
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
    <>
      <button className="emp-edit-back" onClick={onCancel}>
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
              {/* Row 1 */}
              <div
                className={`form-group ${hasError("fullName") ? "has-error" : ""}`}
              >
                <label>Full Name</label>
                <div className="input-with-icon">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    {...register("fullName")}
                  />
                </div>
                <FieldError
                  message={errors.fullName?.message}
                  touched={touchedFields.fullName}
                />
              </div>

              <div
                className={`form-group ${hasError("role") ? "has-error" : ""}`}
              >
                <label>Role</label>
                <div className="input-with-icon">
                  <i className="bi bi-briefcase"></i>
                  <input
                    type="text"
                    placeholder="E.g., HR Manager"
                    {...register("role")}
                  />
                </div>
                <FieldError
                  message={errors.role?.message}
                  touched={touchedFields.role}
                />
              </div>

              {/* Row 2 */}
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
                  touched={touchedFields.email}
                />
              </div>

              <div
                className={`form-group ${hasError("mobileNumber") ? "has-error" : ""}`}
              >
                <label>Mobile Number</label>
                <div className="input-with-icon">
                  <i className="bi bi-telephone"></i>
                  <input
                    type="text"
                    placeholder="10-digit number"
                    {...register("mobileNumber")}
                  />
                </div>
                <FieldError
                  message={errors.mobileNumber?.message}
                  touched={touchedFields.mobileNumber}
                />
              </div>

              {/* Row 3 */}
              <div
                className={`form-group ${hasError("location") ? "has-error" : ""}`}
              >
                <label>Location</label>
                <div className="input-with-icon">
                  <i className="bi bi-geo-alt"></i>
                  <select {...register("location")}>
                    <option value="">Select location</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <FieldError
                  message={errors.location?.message}
                  touched={touchedFields.location}
                />
              </div>

              <div
                className={`form-group ${hasError("companyName") ? "has-error" : ""}`}
              >
                <label>Company Name</label>
                <div className="input-with-icon">
                  <i className="bi bi-building"></i>
                  <input
                    type="text"
                    placeholder="Company Name"
                    {...register("companyName")}
                  />
                </div>
                <FieldError
                  message={errors.companyName?.message}
                  touched={touchedFields.companyName}
                />
              </div>

              {/* Row 4 */}
              <div
                className={`form-group ${hasError("companyWebsite") ? "has-error" : ""}`}
              >
                <label>Company Website</label>
                <div className="input-with-icon">
                  <i className="bi bi-globe"></i>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    {...register("companyWebsite")}
                  />
                </div>
                <FieldError
                  message={errors.companyWebsite?.message}
                  touched={touchedFields.companyWebsite}
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
                  touched={touchedFields.companySize}
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
                    <option value="Banking / Finance / Fintech">
                      Banking / Finance / Fintech
                    </option>
                    <option value="IT / Software">IT / Software</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <FieldError
                  message={errors.industry?.message}
                  touched={touchedFields.industry}
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
                  touched={touchedFields.linkedinUrl}
                />
              </div>

              {/* Row 6 */}
              <div
                className={`form-group ${hasError("registrationNumber") ? "has-error" : ""}`}
              >
                <label>Registration Number</label>
                <div className="input-with-icon">
                  <i className="bi bi-card-heading"></i>
                  <input
                    type="text"
                    placeholder="Reg Number"
                    {...register("registrationNumber")}
                  />
                </div>
                <FieldError
                  message={errors.registrationNumber?.message}
                  touched={touchedFields.registrationNumber}
                />
              </div>

              <div
                className={`form-group ${hasError("panNumber") ? "has-error" : ""}`}
              >
                <label>PAN Number</label>
                <div className="input-with-icon">
                  <i className="bi bi-credit-card"></i>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    {...register("panNumber")}
                  />
                </div>
                <FieldError
                  message={errors.panNumber?.message}
                  touched={touchedFields.panNumber}
                />
              </div>

              {/* Row 7 */}
              <div
                className={`form-group ${hasError("gstNumber") ? "has-error" : ""}`}
              >
                <label>GST Number</label>
                <div className="input-with-icon">
                  <i className="bi bi-receipt"></i>
                  <input
                    type="text"
                    placeholder="15-digit GST Number"
                    {...register("gstNumber")}
                  />
                </div>
                <FieldError
                  message={errors.gstNumber?.message}
                  touched={touchedFields.gstNumber}
                />
              </div>

              {/* Full Width Row */}
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
                  touched={touchedFields.companyDescription}
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
                    <i className="bi bi-cloud-arrow-up"></i>
                    <span>
                      {logoFileName
                        ? logoFileName
                        : "Click to upload your logo (JPG, PNG, SVG)"}
                    </span>
                  </label>
                </div>
                <FieldError
                  message={errors.companyLogo?.message}
                  touched={touchedFields.companyLogo}
                />
              </div>

              {/* Action Buttons */}
              <div className="form-actions full-width">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onCancel}
                  disabled={isSubmitting || updateKycMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={isSubmitting || updateKycMutation.isPending}
                >
                  {updateKycMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
