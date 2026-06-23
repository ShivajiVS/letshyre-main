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
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const resignationRef = useRef(null);
  const experienceRef = useRef(null);
  const offerRef = useRef(null);
  const noticeProofRef = useRef(null);

  const { data: industryData, isLoading: loadingIndustries } =
    useGetIndustries();
  console.log("ind", industryData);
  let rawIndustries = [];
  if (Array.isArray(industryData)) {
    rawIndustries = industryData;
  } else if (industryData && Array.isArray(industryData.data)) {
    rawIndustries = industryData.data;
  }

  const industries =
    rawIndustries.length > 0
      ? rawIndustries
          .map((item) => item?.label || item?.value || item)
          .filter(Boolean)
      : [
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

  const allIndustries = [...industries];

  const [industryOpen, setIndustryOpen] = useState(false);
  const [industrySearch, setIndustrySearch] = useState(
    watch("preferred_industry") || "",
  );

  const preferred_industry = watch("preferred_industry");
  const preferred_locations = watch("preferred_locations");

  // Watch files for display
  const resignationLetter = watch("resignation_letter");
  const experienceLetter = watch("experience_letter");
  const presentOffer = watch("present_offer");
  const noticePeriodProofType = watch("notice_period_proof_type");
  const noticePeriodProof = watch("notice_period_proof");
  const currentCtc = watch("current_ctc");
  const expectedCtc = watch("expected_ctc");
  const company = watch("present_or_last_working_company");
  const lwd = watch("last_day_of_working");

  const filteredIndustries = allIndustries.filter((item) =>
    item.toLowerCase().includes(industrySearch.toLowerCase()),
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
      setError(type, { message: "Only PDF/DOC/DOCX files are allowed" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(type, { message: "File size must be less than 5MB" });
      return;
    }

    clearErrors(type);
    setValue(type, file);
  };

  const handleViewFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handleNextClick = async () => {
    // Strict validation: exact match or fail
    const trimmedSearch = industrySearch?.trim() || "";
    const exactMatch = allIndustries.find(
      (ind) => ind.toLowerCase() === trimmedSearch.toLowerCase()
    );

    if (exactMatch) {
      setValue("preferred_industry", exactMatch);
    } else {
      setValue("preferred_industry", "", { shouldValidate: true });
    }

    const isValid = await trigger([
      "present_or_last_working_company",
      "last_day_of_working",
      "current_ctc",
      "expected_ctc",
      "preferred_industry",
      "preferred_locations_string", // We will use a string field and convert to array
      "notice_period_proof_type",
    ]);

    let hasFileError = false;
    const resignation = watch("resignation_letter");
    const experience = watch("experience_letter");
    const noticeProof = watch("notice_period_proof");

    if (!resignation) {
      setError("resignation_letter", { message: "Resignation Letter is mandatory." });
      hasFileError = true;
    } else {
      clearErrors("resignation_letter");
    }

    if (!experience) {
      setError("experience_letter", { message: "Experience Letter is mandatory." });
      hasFileError = true;
    } else {
      clearErrors("experience_letter");
    }

    if (!noticeProof) {
      setError("notice_period_proof", { message: "Notice Period Proof file is mandatory." });
      hasFileError = true;
    } else {
      clearErrors("notice_period_proof");
    }

    if (!isValid || hasFileError) return;

    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
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
          box-shadow: var(--pc-shadow-soft);
          width: 100%;
        }
        .doc-chip span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
        .doc-chip-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: 16px;
        }
        .doc-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          padding: 0;
        }
        .doc-btn-view { color: #3b82f6; }
        .doc-btn-view:hover { color: #2563eb; }
        .doc-btn-replace { color: #64748b; }
        .doc-btn-replace:hover { color: #475569; }
        .doc-btn-delete { color: #94a3b8; }
        .doc-btn-delete:hover { color: var(--pc-error); }
        
        .doc-upload-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #ffffff;
          border: 1px solid var(--pc-border);
          border-radius: var(--pc-radius-md);
          margin-bottom: 12px;
        }
        .doc-upload-item:last-child { margin-bottom: 0; }
        .doc-info { text-align: left; }
        .doc-title { font-size: 15px; font-weight: 700; color: var(--pc-text-dark); margin: 0 0 4px 0; }
        .doc-desc { font-size: 13px; color: #64748b; margin: 0; }
        .req { color: var(--pc-error); margin-left: 4px; }
        
        .notice-proof-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
        }

        @media (max-width: 576px) {
          .doc-upload-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px;
            gap: 12px;
          }
          .doc-action, .upload-btn-job, .doc-chip {
            width: 100%;
          }
          .notice-proof-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="form-grid">
        <div className="form-group">
          <label>
            Current / Last Company *
            {company && !errors.present_or_last_working_company && (
              <i
                className="bi bi-check-circle-fill"
                style={{ color: "var(--pc-success)", marginLeft: "6px" }}
              ></i>
            )}
          </label>
          <input
            className="pc-input"
            placeholder="e.g. Google, Microsoft"
            {...register("present_or_last_working_company", {
              required: "Company name is required",
            })}
          />
          {errors.present_or_last_working_company && (
            <p className="field-error">
              {errors.present_or_last_working_company.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>
            Last Working Day *
            {lwd && !errors.last_day_of_working && (
              <i
                className="bi bi-check-circle-fill"
                style={{ color: "var(--pc-success)", marginLeft: "6px" }}
              ></i>
            )}
          </label>
          <input
            type="date"
            className="pc-input"
            max="9999-12-31"
            {...register("last_day_of_working", {
              required: "Last working day is required",
            })}
          />
          {errors.last_day_of_working && (
            <p className="field-error">{errors.last_day_of_working.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>
            Current CTC (LPA) *
            {currentCtc && !errors.current_ctc && (
              <i
                className="bi bi-check-circle-fill"
                style={{ color: "var(--pc-success)", marginLeft: "6px" }}
              ></i>
            )}
          </label>
          <input
            type="number"
            step="0.1"
            className="pc-input"
            placeholder="e.g. 12.5"
            {...register("current_ctc", {
              required: "Current CTC is required",
            })}
          />
          {errors.current_ctc && (
            <p className="field-error">{errors.current_ctc.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>
            Expected CTC (LPA) *
            {expectedCtc && !errors.expected_ctc && (
              <i
                className="bi bi-check-circle-fill"
                style={{ color: "var(--pc-success)", marginLeft: "6px" }}
              ></i>
            )}
          </label>
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
          {errors.expected_ctc && (
            <p className="field-error">{errors.expected_ctc.message}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>
          Preferred Industry *
          {preferred_industry && !errors.preferred_industry && (
            <i
              className="bi bi-check-circle-fill"
              style={{ color: "var(--pc-success)", marginLeft: "6px" }}
            ></i>
          )}
        </label>
        <div className="industry-wrap">
          <input
            className="pc-input"
            value={industrySearch}
            placeholder="Search or type your industry"
            onFocus={() => setIndustryOpen(true)}
            onBlur={() => setTimeout(() => setIndustryOpen(false), 200)}
            onChange={(e) => {
              const val = e.target.value;
              setIndustrySearch(val);
              setIndustryOpen(true);

              const exactMatch = allIndustries.find(
                (ind) => ind.toLowerCase() === val.trim().toLowerCase()
              );

              if (exactMatch) {
                setValue("preferred_industry", exactMatch, { shouldValidate: true });
              } else if (preferred_industry) {
                setValue("preferred_industry", "", { shouldValidate: true });
              }
            }}
          />
          {loadingIndustries && (
            <div style={{ fontSize: 12, marginTop: 4, color: "#64748b" }}>
              Loading industries...
            </div>
          )}

          {industryOpen && (
            <div className="industry-dropdown">
              {filteredIndustries.map((item, i) => (
                <div
                  key={i}
                  className="industry-option"
                  onClick={() => {
                    setValue("preferred_industry", item, {
                      shouldValidate: true,
                    });
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
                  style={{ color: "#94a3b8", cursor: "default" }}
                >
                  No industries found
                </div>
              )}
            </div>
          )}
        </div>
        {/* Hidden input to register with react-hook-form */}
        <input
          type="hidden"
          {...register("preferred_industry", {
            required: "Please select a valid industry from the dropdown",
          })}
        />
        {errors.preferred_industry && (
          <p className="field-error">{errors.preferred_industry.message}</p>
        )}
      </div>

      <div className="form-group">
        <label>
          Preferred Locations *
          {preferred_locations &&
            preferred_locations.length > 0 &&
            !errors.preferred_locations_string && (
              <i
                className="bi bi-check-circle-fill"
                style={{ color: "var(--pc-success)", marginLeft: "6px" }}
              ></i>
            )}
        </label>
        <input
          className="pc-input"
          placeholder="e.g. Hyderabad, Bangalore, Pune (comma separated)"
          {...register("preferred_locations_string", {
            required: "At least one preferred location is required",
            onChange: (e) => {
              // Sync with the actual array field if needed, or we just parse it on submit
              const arr = e.target.value
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean);
              setValue("preferred_locations", arr);
            },
          })}
        />
        {errors.preferred_locations_string && (
          <p className="field-error">
            {errors.preferred_locations_string.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label>Upload Mandatory Documents</label>
        <div className="upload-card-job">
          {/* Resignation Letter */}
          <div style={{ marginBottom: "12px" }}>
            <div className="doc-upload-item" style={{ marginBottom: 0 }}>
            <div className="doc-info">
              <h4 className="doc-title">
                Resignation Letter <span className="req">*</span>
              </h4>
              <p className="doc-desc">
                Official resignation acceptance or email.
              </p>
            </div>
            <div className="doc-action">
              {resignationLetter ? (
                <div className="doc-chip">
                  <span>
                    <i className="bi bi-file-earmark-check text-green-600 mr-2"></i>{" "}
                    {resignationLetter.name}
                  </span>
                  <div className="doc-chip-actions">
                    <button
                      type="button"
                      className="doc-btn doc-btn-view"
                      title="View File"
                      onClick={() => handleViewFile(resignationLetter)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="doc-btn doc-btn-replace"
                      title="Replace File"
                      onClick={() => resignationRef.current.click()}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                    </button>
                    <button
                      type="button"
                      className="doc-btn doc-btn-delete"
                      title="Remove File"
                      onClick={() => setValue("resignation_letter", null)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="upload-btn-job"
                  onClick={() => resignationRef.current.click()}
                >
                  <i className="bi bi-upload"></i> Upload
                </button>
              )}
              <input
                hidden
                ref={resignationRef}
                type="file"
                onChange={(e) => handleFile(e, "resignation_letter")}
              />
            </div>
          </div>
          {errors.resignation_letter && (
            <p className="field-error" style={{ marginTop: "4px", paddingLeft: "16px" }}>
              {errors.resignation_letter.message}
            </p>
          )}
        </div>

          {/* Experience Letter */}
          <div style={{ marginBottom: "12px" }}>
            <div className="doc-upload-item" style={{ marginBottom: 0 }}>
            <div className="doc-info">
              <h4 className="doc-title">
                Experience Letter <span className="req">*</span>
              </h4>
              <p className="doc-desc">
                Experience or relieving letter from past company.
              </p>
            </div>
            <div className="doc-action">
              {experienceLetter ? (
                <div className="doc-chip">
                  <span>
                    <i className="bi bi-file-earmark-check text-green-600 mr-2"></i>{" "}
                    {experienceLetter.name}
                  </span>
                  <div className="doc-chip-actions">
                    <button
                      type="button"
                      className="doc-btn doc-btn-view"
                      title="View File"
                      onClick={() => handleViewFile(experienceLetter)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="doc-btn doc-btn-replace"
                      title="Replace File"
                      onClick={() => experienceRef.current.click()}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                    </button>
                    <button
                      type="button"
                      className="doc-btn doc-btn-delete"
                      title="Remove File"
                      onClick={() => setValue("experience_letter", null)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="upload-btn-job"
                  onClick={() => experienceRef.current.click()}
                >
                  <i className="bi bi-upload"></i> Upload
                </button>
              )}
              <input
                hidden
                ref={experienceRef}
                type="file"
                onChange={(e) => handleFile(e, "experience_letter")}
              />
            </div>
          </div>
          {errors.experience_letter && (
            <p className="field-error" style={{ marginTop: "4px", paddingLeft: "16px" }}>
              {errors.experience_letter.message}
            </p>
          )}
        </div>

          {/* Notice Period Proof */}
          <div style={{ marginBottom: "12px" }}>
            <div
              className="doc-upload-item"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                marginBottom: 0,
              }}
            >
            <div className="doc-info" style={{ width: "100%" }}>
              <h4 className="doc-title">
                Notice Period Proof <span className="req">*</span>
              </h4>
              <p className="doc-desc">
                Select the type of proof you have, then upload the corresponding
                document.
              </p>
            </div>

            <div
              className="notice-proof-grid"
              style={{ width: "100%", alignItems: "start" }}
            >
              <div style={{ width: "100%" }}>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Select Proof Type *
                  <div className="pc-tooltip-container">
                    <i className="bi bi-question-circle pc-tooltip-icon"></i>
                    <span className="pc-tooltip-text">
                      If serving notice, upload your new offer. If already
                      relieved, upload your relieving letter.
                    </span>
                  </div>
                  {noticePeriodProofType &&
                    !errors.notice_period_proof_type && (
                      <i
                        className="bi bi-check-circle-fill"
                        style={{
                          color: "var(--pc-success)",
                          marginLeft: "6px",
                          fontSize: "14px",
                        }}
                      ></i>
                    )}
                </label>
                <select
                  className="pc-select"
                  style={{ margin: 0 }}
                  {...register("notice_period_proof_type", {
                    required: "Notice period proof type is required",
                  })}
                >
                  <option value="">Select Proof Type</option>
                  <option value="Relieving Letter">Relieving Letter</option>
                  <option value="Offer Letter">Offer Letter</option>
                </select>
                {errors.notice_period_proof_type && (
                  <p
                    className="field-error"
                    style={{ marginTop: "4px", textAlign: "left" }}
                  >
                    {errors.notice_period_proof_type.message}
                  </p>
                )}
              </div>

              <div
                className="doc-action"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "8px",
                    display: "block",
                    visibility: "hidden",
                  }}
                >
                  Upload
                </label>
                {noticePeriodProof ? (
                  <div className="doc-chip" style={{ margin: 0 }}>
                    <span>
                      <i className="bi bi-file-earmark-check text-green-600 mr-2"></i>{" "}
                      {noticePeriodProof.name}
                    </span>
                    <div className="doc-chip-actions">
                      <button
                        type="button"
                        className="doc-btn doc-btn-view"
                        title="View File"
                        onClick={() => handleViewFile(noticePeriodProof)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        type="button"
                        className="doc-btn doc-btn-replace"
                        title="Replace File"
                        onClick={() => noticeProofRef.current.click()}
                      >
                        <i className="bi bi-arrow-repeat"></i>
                      </button>
                      <button
                        type="button"
                        className="doc-btn doc-btn-delete"
                        title="Remove File"
                        onClick={() => setValue("notice_period_proof", null)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="upload-btn-job"
                    style={{ margin: 0 }}
                    onClick={() => noticeProofRef.current.click()}
                  >
                    <i className="bi bi-upload"></i> Upload Proof
                  </button>
                )}
                <input
                  hidden
                  ref={noticeProofRef}
                  type="file"
                  onChange={(e) => handleFile(e, "notice_period_proof")}
                />
              </div>
            </div>
          </div>
          {errors.notice_period_proof && (
            <p className="field-error" style={{ marginTop: "4px", paddingLeft: "16px" }}>
              {errors.notice_period_proof.message}
            </p>
          )}
        </div>
        </div>

        <label style={{ marginTop: "24px", display: "block" }}>
          Optional Documents
        </label>
        <div className="upload-card-job" style={{ marginTop: "8px" }}>
          {/* Present Offer Letter */}
          <div style={{ marginBottom: "12px" }}>
            <div className="doc-upload-item" style={{ marginBottom: 0 }}>
            <div className="doc-info">
              <h4 className="doc-title">Present Offer Letter</h4>
              <p className="doc-desc">
                Do you have an existing offer? Upload it here.
              </p>
            </div>
            <div className="doc-action">
              {presentOffer ? (
                <div className="doc-chip">
                  <span>
                    <i className="bi bi-file-earmark-check text-green-600 mr-2"></i>{" "}
                    {presentOffer.name}
                  </span>
                  <div className="doc-chip-actions">
                    <button
                      type="button"
                      className="doc-btn doc-btn-view"
                      title="View File"
                      onClick={() => handleViewFile(presentOffer)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="doc-btn doc-btn-replace"
                      title="Replace File"
                      onClick={() => offerRef.current.click()}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                    </button>
                    <button
                      type="button"
                      className="doc-btn doc-btn-delete"
                      title="Remove File"
                      onClick={() => setValue("present_offer", null)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="upload-btn-job"
                  onClick={() => offerRef.current.click()}
                >
                  <i className="bi bi-upload"></i> Upload
                </button>
              )}
              <input
                hidden
                ref={offerRef}
                type="file"
                onChange={(e) => handleFile(e, "present_offer")}
              />
            </div>
          </div>
          {errors.present_offer && (
            <p className="field-error" style={{ marginTop: "4px", paddingLeft: "16px" }}>
              {errors.present_offer.message}
            </p>
          )}
        </div>
        </div>
      </div>

      <div className="pc-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <button type="button" className="btn-primary" onClick={handleNextClick}>
          Continue <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </motion.div>
  );
}

export default StepJobPreferences;
