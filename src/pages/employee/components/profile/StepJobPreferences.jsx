import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { useGetIndustries } from "../../../../hooks/employee/useProfile";

function StepJobPreferences({ onNext, onBack }) {
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const resignationRef = useRef(null);
  const experienceRef = useRef(null);
  const offerRef = useRef(null);

  const { data: industryData, isLoading: loadingIndustries } = useGetIndustries();
  const industries = Array.isArray(industryData?.data)
    ? industryData.data.map((item) => item?.label || item?.value).filter(Boolean)
    : industryData?.data || [
        "IT / Software Development",
        "IT / Hardware & Networking",
        "AI / Machine Learning",
        "Data Science / Analytics",
        "Cyber Security / InfoSec",
        "Finance",
        "Healthcare",
        "Education",
        "Manufacturing",
        "Sales",
        "Marketing",
      ];
  
  const allIndustries = [...industries, "Other"];

  const [industryOpen, setIndustryOpen] = useState(false);
  const [industrySearch, setIndustrySearch] = useState(watch("preferred_industry") || "");
  const [fileError, setFileError] = useState("");

  const preferred_industry = watch("preferred_industry");
  const preferred_locations = watch("preferred_locations");
  
  // Watch files for display
  const resignationLetter = watch("resignation_letter");
  const experienceLetter = watch("experience_letter");
  const presentOffer = watch("present_offer");
  const currentCtc = watch("current_ctc");

  const filteredIndustries = allIndustries.filter((item) =>
    item.toLowerCase().includes(industrySearch.toLowerCase())
  );

  const handleFile = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      setFileError("Only PDF/DOC/DOCX files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size must be less than 5MB");
      return;
    }

    setFileError("");
    setValue(type, file);
  };

  const handleNextClick = async () => {
    const isValid = await trigger([
      "present_or_last_working_company",
      "last_day_of_working",
      "current_ctc",
      "expected_ctc",
      "preferred_industry",
      "preferred_locations_string", // We will use a string field and convert to array
    ]);

    if (!isValid) return;
    
    // Ensure industry is set if typed manually
    if (industrySearch && !allIndustries.includes(industrySearch)) {
        setValue("preferred_industry", industrySearch);
    }
    
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <style>{`
        .industry-wrap { position: relative; }
        .industry-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1px solid var(--pc-border);
          border-radius: var(--pc-radius-md);
          max-height: 250px;
          overflow-y: auto;
          z-index: 50;
          box-shadow: var(--pc-shadow-hover);
          margin-top: 4px;
        }
        .industry-option {
          padding: 12px 16px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        .industry-option:hover { background: #f1f5f9; }
        
        .upload-card-job {
          background: #f8fafc;
          border-radius: var(--pc-radius-lg);
          padding: 24px;
          margin-top: 16px;
          border: 1px dashed var(--pc-border);
        }
        .upload-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          margin-bottom: 24px;
        }
        .upload-btn-job {
          background: #ffffff;
          border: 1px solid var(--pc-border);
          padding: 12px 20px;
          border-radius: var(--pc-radius-md);
          font-weight: 600;
          color: var(--pc-text-dark);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: var(--pc-shadow-soft);
        }
        .upload-btn-job:hover {
          border-color: var(--pc-secondary);
          color: var(--pc-secondary);
          transform: translateY(-2px);
        }
        .doc-chip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 12px 16px;
          border-radius: var(--pc-radius-sm);
          font-size: 14px;
          border: 1px solid #e2e8f0;
          margin-bottom: 8px;
          box-shadow: var(--pc-shadow-soft);
        }
        .doc-chip button {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 16px;
        }
        .doc-chip button:hover { color: var(--pc-error); }
        .optional-badge {
          font-size: 12px;
          color: #94a3b8;
          font-weight: normal;
          margin-left: 8px;
        }
      `}</style>

      <div className="form-grid">
        <div className="form-group">
          <label>Current / Last Company *</label>
          <input
            className="pc-input"
            placeholder="e.g. Google, Microsoft"
            {...register("present_or_last_working_company", {
              required: "Company name is required",
            })}
          />
          {errors.present_or_last_working_company && (
            <p className="field-error">{errors.present_or_last_working_company.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Last Working Day *</label>
          <input
            type="date"
            className="pc-input"
            {...register("last_day_of_working", { required: "Last working day is required" })}
          />
          {errors.last_day_of_working && (
            <p className="field-error">{errors.last_day_of_working.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Current CTC (LPA) *</label>
          <input
            type="number"
            step="0.1"
            className="pc-input"
            placeholder="e.g. 12.5"
            {...register("current_ctc", { required: "Current CTC is required" })}
          />
          {errors.current_ctc && <p className="field-error">{errors.current_ctc.message}</p>}
        </div>

        <div className="form-group">
          <label>Expected CTC (LPA) *</label>
          <input
            type="number"
            step="0.1"
            className="pc-input"
            placeholder="e.g. 18.0"
            {...register("expected_ctc", {
              required: "Expected CTC is required",
              validate: (val) => {
                if (parseFloat(val) < parseFloat(currentCtc)) {
                  return "Expected CTC cannot be lower than Current CTC";
                }
                return true;
              },
            })}
          />
          {errors.expected_ctc && <p className="field-error">{errors.expected_ctc.message}</p>}
        </div>
      </div>

      <div className="form-group">
        <label>Preferred Industry *</label>
        <div className="industry-wrap">
          <input
            className="pc-input"
            value={industrySearch}
            placeholder="Search or type your industry"
            onFocus={() => setIndustryOpen(true)}
            onBlur={() => setTimeout(() => setIndustryOpen(false), 200)}
            onChange={(e) => {
              setIndustrySearch(e.target.value);
              setValue("preferred_industry", e.target.value);
              setIndustryOpen(true);
            }}
          />
          {loadingIndustries && <div style={{ fontSize: 12, marginTop: 4, color: "#64748b" }}>Loading industries...</div>}

          {industryOpen && (
            <div className="industry-dropdown">
              {filteredIndustries.map((item, i) => (
                <div
                  key={i}
                  className="industry-option"
                  onClick={() => {
                    setValue("preferred_industry", item, { shouldValidate: true });
                    setIndustrySearch(item);
                    setIndustryOpen(false);
                  }}
                >
                  {item}
                </div>
              ))}
              {!filteredIndustries.length && (
                <div
                  className="industry-option"
                  onClick={() => {
                    setValue("preferred_industry", industrySearch, { shouldValidate: true });
                    setIndustryOpen(false);
                  }}
                >
                  Use "{industrySearch}"
                </div>
              )}
            </div>
          )}
        </div>
        {/* Hidden input to register with react-hook-form */}
        <input type="hidden" {...register("preferred_industry", { required: "Preferred industry is required" })} />
        {errors.preferred_industry && <p className="field-error">{errors.preferred_industry.message}</p>}
      </div>

      <div className="form-group">
        <label>Preferred Locations *</label>
        <input
          className="pc-input"
          placeholder="e.g. Hyderabad, Bangalore, Pune (comma separated)"
          {...register("preferred_locations_string", {
            required: "At least one preferred location is required",
            onChange: (e) => {
               // Sync with the actual array field if needed, or we just parse it on submit
               const arr = e.target.value.split(",").map(x => x.trim()).filter(Boolean);
               setValue("preferred_locations", arr);
            }
          })}
        />
        {errors.preferred_locations_string && <p className="field-error">{errors.preferred_locations_string.message}</p>}
      </div>

      <div className="form-group">
        <label>
          Upload Documents <span className="optional-badge">(Optional)</span>
        </label>
        <div className="upload-card-job">
          <div className="upload-buttons">
            <button type="button" className="upload-btn-job" onClick={() => resignationRef.current.click()}>
              📄 Resignation Letter
            </button>
            <input hidden ref={resignationRef} type="file" onChange={(e) => handleFile(e, "resignation_letter")} />

            <button type="button" className="upload-btn-job" onClick={() => experienceRef.current.click()}>
              📄 Experience Letter
            </button>
            <input hidden ref={experienceRef} type="file" onChange={(e) => handleFile(e, "experience_letter")} />

            <button type="button" className="upload-btn-job" onClick={() => offerRef.current.click()}>
              📄 Offer Letter
            </button>
            <input hidden ref={offerRef} type="file" onChange={(e) => handleFile(e, "present_offer")} />
          </div>

          <div className="file-preview">
            {resignationLetter && (
              <div className="doc-chip">
                <span><i className="bi bi-file-earmark-check text-green-600 mr-2"></i> {resignationLetter.name}</span>
                <button type="button" onClick={() => setValue("resignation_letter", null)}>✕</button>
              </div>
            )}
            {experienceLetter && (
              <div className="doc-chip">
                <span><i className="bi bi-file-earmark-check text-green-600 mr-2"></i> {experienceLetter.name}</span>
                <button type="button" onClick={() => setValue("experience_letter", null)}>✕</button>
              </div>
            )}
            {presentOffer && (
              <div className="doc-chip">
                <span><i className="bi bi-file-earmark-check text-green-600 mr-2"></i> {presentOffer.name}</span>
                <button type="button" onClick={() => setValue("present_offer", null)}>✕</button>
              </div>
            )}
          </div>
        </div>
        {fileError && <div className="error-msg" style={{ marginTop: 16 }}>{fileError}</div>}
      </div>

      <div className="pc-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="btn-primary" onClick={handleNextClick}>
          Continue →
        </button>
      </div>
    </motion.div>
  );
}

export default StepJobPreferences;
