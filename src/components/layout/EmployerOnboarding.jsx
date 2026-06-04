import { useState } from "react";
import { useNavigate } from "react-router";

import KYCImg from "@/assets/EmployerKYC.png";
import brand from "@/assets/LETSHYRE.png";
import e_demo01 from "@/assets/emp-demo01.png";
import e_demo02 from "@/assets/emp-demo02.png";
import { logoutMe } from "@/services/auth.service";

import "./styles/employer-onboarding.css";

export function EmployerOnboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate("/employer");
  };

  const handleLogout = async () => {
    await logoutMe(); // clears tokens + calls backend
    navigate("/employer/sign-in", { replace: true });
  };

  const [form, setForm] = useState({
    fullName: "",
    role: "",
    companyName: "",
    website: "",
    companySize: "",
    location: "",
    industry: "",
    source: "",
    gst: "",
    regNumber: "",
  });

  const [files, setFiles] = useState({
    logo: null,
    address: null,
    gstCert: null,
    regCert: null,
    idProof: null,
    bankProof: null,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;

    setFiles({
      ...files,
      [name]: selected[0],
    });
  };

  const isFormValid = () => {
    return (
      form.fullName &&
      form.companyName &&
      form.website &&
      form.companySize &&
      form.location &&
      form.source &&
      form.gst &&
      form.regNumber &&
      files.logo &&
      files.address &&
      files.gstCert &&
      files.regCert &&
      files.idProof &&
      files.bankProof
    );
  };

  const handleContinue = () => {
    if (!isFormValid()) {
      alert(" Please fill all required fields and upload all documents.");
      return;
    }

    setStep(2);
  };

  return (
    <div className={`onboard-page ${step === 2 ? "step2" : ""}`}>
      <img src={brand} className="brand-name" alt="brand" />

      <div className={`onboard-wrapper ${step === 2 ? "video-layout" : ""}`}>
        {step === 2 && (
          <>
            <img
              src={e_demo01}
              className="demo-image demo-image01"
              alt="demo"
            />
            <img
              src={e_demo02}
              className="demo-image demo-image02"
              alt="demo"
            />
          </>
        )}

        {/* LEFT IMAGE ONLY FOR STEP 1 */}
        {step === 1 && (
          <div className="onboard-left">
            <img src={KYCImg} alt="illustration" />
          </div>
        )}

        {/* RIGHT CARD */}
        <div className="onboard-card">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2>LET'S GET TO KNOW YOU</h2>

              <div className="form-scroll">
                <div className="onboard-grid">
                  <FloatingInput
                    label="Full Name"
                    name="fullName"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Company Name"
                    name="companyName"
                    required
                    value={form.companyName}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Company Website"
                    name="website"
                    required
                    value={form.website}
                    onChange={handleChange}
                  />

                  <select
                    name="companySize"
                    value={form.companySize}
                    onChange={handleChange}
                  >
                    <option value="">Company Size *</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>200+</option>
                  </select>

                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                  >
                    <option value="">Location *</option>
                    <option>India</option>
                    <option>USA</option>
                    <option>Europe</option>
                  </select>

                  <select
                    className="full"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                  >
                    <option value="">Industry</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Telecommunications">
                      Telecommunications
                    </option>
                    <option value="Media & Entertainment">
                      Media & Entertainment
                    </option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Construction">Construction</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Energy">Energy</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Tourism">Tourism</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Government">Government</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Marketing & Advertising">
                      Marketing & Advertising
                    </option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Non-Profit">Non-Profit</option>
                    <option value="Research & Development">
                      Research & Development
                    </option>
                    <option value="Other">Other</option>
                  </select>

                  <select
                    className="full"
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                  >
                    <option value="">How did you find us? </option>
                    <option>Google</option>
                    <option>LinkedIn</option>
                    <option>Friend</option>
                  </select>

                  <FloatingInput
                    label="GST Number"
                    name="gst"
                    required
                    value={form.gst}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Registration Number"
                    name="regNumber"
                    required
                    value={form.regNumber}
                    onChange={handleChange}
                  />

                  <FileUpload
                    label="Company Logo"
                    name="logo"
                    file={files.logo}
                    onChange={handleFileChange}
                  />

                  <FileUpload
                    label="Address Proof"
                    name="address"
                    file={files.address}
                    onChange={handleFileChange}
                  />

                  <FileUpload
                    label="GST Certificate"
                    name="gstCert"
                    file={files.gstCert}
                    onChange={handleFileChange}
                  />

                  <FileUpload
                    label="Reg Certificate"
                    name="regCert"
                    file={files.regCert}
                    onChange={handleFileChange}
                  />

                  <FileUpload
                    label="ID Proof"
                    name="idProof"
                    file={files.idProof}
                    onChange={handleFileChange}
                  />

                  <FileUpload
                    label="Bank Proof"
                    name="bankProof"
                    file={files.bankProof}
                    onChange={handleFileChange}
                  />
                </div>

                <button className="continue-btn" onClick={handleContinue}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* STEP 2 VIDEO */}
          {step === 2 && (
            <div className="video-step">
              <div className="video-box">
                <iframe
                  src="https://www.youtube.com/embed/hcNVG7JCxoE?si=pXZhZ-peiVIZ8PnS"
                  title="Intro"
                  allowFullScreen
                />
              </div>

              <div className="video-content">
                <h3>
                  See How The <br /> Pro-Recruiters Use LETSHYRE
                </h3>

                <p>
                  Watch our quick walkthrough to maximize your credits and find
                  top talent faster.
                </p>

                <button className="skip-btn" onClick={handleSkip}>
                  Skip For Now →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Floating Input */
function FloatingInput({ label, name, value, onChange, required }) {
  return (
    <div className="floating-input">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
      />

      <label>
        {label} {required && <span>*</span>}
      </label>
    </div>
  );
}

/* File Upload */
function FileUpload({ label, name, file, onChange, required }) {
  return (
    <div className="file-upload">
      <span>
        {file ? file.name : label}
        {required && <span className="required">*</span>}
      </span>

      <label className="e-upload-btn">
        {file ? <p>Replace</p> : <p>Select File</p>}

        <input
          type="file"
          name={name}
          onChange={onChange}
          required={required}
          hidden
        />
      </label>
    </div>
  );
}
