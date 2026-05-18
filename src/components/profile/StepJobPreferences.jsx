import { useRef, useState, useEffect } from "react";

function StepJobPreferences({
  onNext,
  onBack,
  setProfileData,
  profileData = {},
}) {
  const resignationRef = useRef(null);
  const experienceRef = useRef(null);
  const offerRef = useRef(null);

  /* ---------------------------
     FORM STATE
  --------------------------- */

  const [form, setForm] = useState({
    company: profileData.present_or_last_working_company || "",

    lastDate: profileData.last_day_of_working || "",

    currentCTC: profileData.current_ctc || "",

    expectedCTC: profileData.expected_ctc || "",

    industry: profileData.preferred_industry || "",

    customIndustry: "",

    locations: Array.isArray(profileData.preferred_locations)
      ? profileData.preferred_locations.join(", ")
      : profileData.preferred_locations || "",
  });

  const [files, setFiles] = useState({
    resignation: profileData.resignation_letter || null,

    experience: profileData.experience_letter || null,

    offer: profileData.present_offer || null,
  });

  const [industries, setIndustries] = useState([]);
  const [loadingIndustries, setLoadingIndustries] = useState(true);

  const [industrySearch, setIndustrySearch] = useState(
    profileData.preferred_industry || ""
  );

  const [industryOpen, setIndustryOpen] = useState(false);

  const [error, setError] = useState("");

  /* ---------------------------
FETCH INDUSTRIES
--------------------------- */

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      setLoadingIndustries(true);

      const res = await fetch(
        "https://api.letshyre.com/user/v1/industries/list/",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Industry API failed");
      }

      const response = await res.json();

      let mapped = [];

      if (response?.data && Array.isArray(response.data)) {
        mapped = response.data
          .map((item) => item?.label || item?.value)
          .filter(Boolean);
      }

      setIndustries([...mapped, "Other"]);
    } catch (e) {
      console.error(e);

      setIndustries([
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
        "Other",
      ]);
    } finally {
      setLoadingIndustries(false);
    }
  };

  /* ---------------------------
FILTER
--------------------------- */

  const filteredIndustries = industries.filter((item) =>
    item.toLowerCase().includes(industrySearch.toLowerCase())
  );

  /* ---------------------------
FILES
--------------------------- */

  const handleFile = (e, type) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      setError("Only PDF/DOC/DOCX allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File max 5MB");
      return;
    }

    setError("");

    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  /* ---------------------------
SUBMIT
IMPORTANT FIX:
NO prev=> callback
--------------------------- */

  const handleNextClick = () => {
    let industryValue =
      form.industry === "Other" ? form.customIndustry : form.industry;

    if (industrySearch && !industries.includes(industrySearch)) {
      industryValue = industrySearch;
    }

    if (
      !form.company.trim() ||
      !form.lastDate ||
      !form.currentCTC ||
      !form.expectedCTC ||
      !industryValue.trim() ||
      !form.locations.trim()
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (parseFloat(form.expectedCTC) < parseFloat(form.currentCTC)) {
      setError("Expected CTC cannot be lower than Current CTC");
      return;
    }

    /* FIXED HERE */

    setProfileData({
      present_or_last_working_company: form.company.trim(),

      last_day_of_working: form.lastDate,

      current_ctc: form.currentCTC,

      expected_ctc: form.expectedCTC,

      preferred_industry: industryValue.trim(),

      preferred_locations: form.locations
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),

      resignation_letter: files.resignation,

      experience_letter: files.experience,

      present_offer: files.offer,
    });

    onNext();
  };

  return (
    <>
      <style>{`

.job-card{
padding:14px 10px;
}

.id-para{
font-size:18px;
font-weight:700;
color:#5b88ff;
margin-bottom:24px;
}

.job-card label{
display:block;
font-size:15px;
font-weight:600;
margin-top:15px;
margin-bottom:8px;
}

.field{
width:100%;
padding:14px 18px;
border:1px solid #d8d8d8;
border-radius:12px;
font-size:15px;
margin-bottom:8px;
}

.field:focus{
outline:none;
border-color:#4c84ff;
box-shadow:
0 0 0 3px rgba(76,132,255,.08);
}

.industry-wrap{
position:relative;
}

.loading-text{
font-size:12px;
color:#777;
margin-bottom:8px;
}

.industry-dropdown{
position:absolute;
top:100%;
left:0;
right:0;
background:#fff;
border:1px solid #ddd;
border-radius:12px;
max-height:250px;
overflow:auto;
z-index:999;
box-shadow:
0 8px 24px rgba(0,0,0,.08);
}

.industry-option{
padding:12px 15px;
cursor:pointer;
}

.industry-option:hover{
background:#eef4ff;
}

.upload-title{
margin-top:24px;
font-size:16px;
font-weight:700;
}

.upload-card{
margin-top:14px;
padding:24px;
background:#eef4ff;
border-radius:22px;

display:flex;
flex-wrap:wrap;
gap:14px;
justify-content:center;
}

.upload-btn{
border:none;
background:
linear-gradient(
135deg,
#6798ff,
#3876f8
);

color:#fff;
padding:14px 22px;
border-radius:14px;
font-weight:600;
cursor:pointer;
}

.file-preview{
width:100%;
margin-top:12px;
display:flex;
flex-direction:column;
gap:10px;
}

.doc-chip{
display:flex;
justify-content:space-between;
align-items:center;
background:#fff;
padding:10px 14px;
border-radius:10px;
font-size:13px;
}

.doc-chip button{
background:none;
border:none;
cursor:pointer;
}

.error-msg{
margin-top:18px;
padding:12px;
border-radius:10px;
background:#ffe6e6;
color:#d62828;
font-weight:600;
text-align:center;
}

.job-actions{
margin-top:28px;
display:flex;
justify-content:space-between;
}

.pc-back-btn{
background:#000;
color:#fff;
border:none;
padding:12px 24px;
border-radius:10px;
}

.btn-next{
background:#4c84ff;
color:#fff;
border:none;
padding:12px 26px;
border-radius:10px;
font-weight:600;
}

`}</style>

      <div className="pc-step-content">
        <div className="job-card">
          <p className="id-para">Tell us about your job preferences</p>

          <label>Current / Last Company *</label>

          <input
            className="field"
            value={form.company}
            onChange={(e) =>
              setForm({
                ...form,
                company: e.target.value,
              })
            }
          />

          <label>Last Working Day *</label>

          <input
            className="field"
            type="date"
            value={form.lastDate}
            onChange={(e) =>
              setForm({
                ...form,
                lastDate: e.target.value,
              })
            }
          />

          <label>Current CTC *</label>

          <input
            className="field"
            type="number"
            value={form.currentCTC}
            onChange={(e) =>
              setForm({
                ...form,
                currentCTC: e.target.value,
              })
            }
          />

          <label>Expected CTC *</label>

          <input
            className="field"
            type="number"
            value={form.expectedCTC}
            onChange={(e) =>
              setForm({
                ...form,
                expectedCTC: e.target.value,
              })
            }
          />

          <label>Preferred Industry *</label>

          <div className="industry-wrap">
            <input
              className="field"
              value={industrySearch}
              placeholder="Search industry"
              onFocus={() => setIndustryOpen(true)}
              onBlur={() => setTimeout(() => setIndustryOpen(false), 200)}
              onChange={(e) => {
                setIndustrySearch(e.target.value);
                setIndustryOpen(true);
              }}
            />

            {loadingIndustries && (
              <div className="loading-text">Loading industries...</div>
            )}

            {industryOpen && (
              <div className="industry-dropdown">
                {filteredIndustries.map((item, i) => (
                  <div
                    key={i}
                    className="industry-option"
                    onClick={() => {
                      setForm({
                        ...form,
                        industry: item,
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
                    onClick={() => {
                      setForm({
                        ...form,
                        industry: "Other",
                      });
                      setIndustryOpen(false);
                    }}
                  >
                    Use "{industrySearch}"
                  </div>
                )}
              </div>
            )}
          </div>

          {form.industry === "Other" && (
            <input
              className="field"
              value={form.customIndustry}
              placeholder="Custom industry"
              onChange={(e) =>
                setForm({
                  ...form,
                  customIndustry: e.target.value,
                })
              }
            />
          )}

          <label>Preferred Locations *</label>

          <input
            className="field"
            value={form.locations}
            placeholder="Hyderabad, Chennai"
            onChange={(e) =>
              setForm({
                ...form,
                locations: e.target.value,
              })
            }
          />

          <p className="upload-title">Upload Documents (Optional)</p>

          <div className="upload-card">
            <button
              className="upload-btn"
              onClick={() => resignationRef.current.click()}
            >
              📄 Resignation Letter
            </button>

            <input
              hidden
              ref={resignationRef}
              type="file"
              onChange={(e) => handleFile(e, "resignation")}
            />

            <button
              className="upload-btn"
              onClick={() => experienceRef.current.click()}
            >
              📄 Experience Letter
            </button>

            <input
              hidden
              ref={experienceRef}
              type="file"
              onChange={(e) => handleFile(e, "experience")}
            />

            <button
              className="upload-btn"
              onClick={() => offerRef.current.click()}
            >
              📄 Offer Letter
            </button>

            <input
              hidden
              ref={offerRef}
              type="file"
              onChange={(e) => handleFile(e, "offer")}
            />

            <div className="file-preview">
              {files.resignation && (
                <div className="doc-chip">
                  <span>✓ {files.resignation.name}</span>
                  <button
                    onClick={() =>
                      setFiles((prev) => ({
                        ...prev,
                        resignation: null,
                      }))
                    }
                  >
                    ✕
                  </button>
                </div>
              )}

              {files.experience && (
                <div className="doc-chip">
                  <span>✓ {files.experience.name}</span>
                  <button
                    onClick={() =>
                      setFiles((prev) => ({
                        ...prev,
                        experience: null,
                      }))
                    }
                  >
                    ✕
                  </button>
                </div>
              )}

              {files.offer && (
                <div className="doc-chip">
                  <span>✓ {files.offer.name}</span>
                  <button
                    onClick={() =>
                      setFiles((prev) => ({
                        ...prev,
                        offer: null,
                      }))
                    }
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div className="job-actions">
            <button className="pc-back-btn" onClick={onBack}>
              Back
            </button>

            <button className="btn-next" onClick={handleNextClick}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StepJobPreferences;
