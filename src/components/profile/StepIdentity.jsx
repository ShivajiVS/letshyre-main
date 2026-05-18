import { useRef, useState, useEffect } from "react";
import cam from "@/assets/cam01.png";

function StepIdentity({ onNext, setProfileData, profileData = {} }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  /* ---------------- STATE ---------------- */

  const [gender, setGender] = useState(profileData.gender || "");

  const [dob, setDob] = useState(profileData.dob || "");

  const [location, setLocation] = useState(profileData.location || "");

  const [address, setAddress] = useState(profileData.address || "");

  const [aadhaar, setAadhaar] = useState(
    profileData.aadhar_number
      ? profileData.aadhar_number.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3")
      : ""
  );

  const [capturedImage, setCapturedImage] = useState(
    profileData.profile_photo || null
  );

  const [previewUrl, setPreviewUrl] = useState("");

  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  const [citySuggestions, setCitySuggestions] = useState([]);

  /* ---------------- Preview Handling ---------------- */

  useEffect(() => {
    if (capturedImage && typeof capturedImage !== "string") {
      const url = URL.createObjectURL(capturedImage);

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    if (typeof capturedImage === "string") {
      setPreviewUrl(capturedImage);
    }
  }, [capturedImage]);

  /* ---------------- Aadhaar Validation ---------------- */

  const multiplication = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  const permutation = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  function validAadhaar(a) {
    if (!/^\d{12}$/.test(a)) return false;

    if (/^(\d)\1+$/.test(a)) return false;

    let c = 0;

    const digits = a.split("").reverse().map(Number);

    for (let i = 0; i < digits.length; i++) {
      c = multiplication[c][permutation[i % 8][digits[i]]];
    }

    return c === 0;
  }

  /* ---------------- AGE ---------------- */

  const validateAge = () => {
    if (!dob) return false;

    const birth = new Date(dob);

    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age >= 18;
  };

  /* ---------------- Validation ---------------- */

  const setFieldError = (field, msg) => {
    setErrors((prev) => ({
      ...prev,
      [field]: msg,
    }));
  };

  const clearFieldError = (field) => {
    setErrors((prev) => {
      const copy = {
        ...prev,
      };
      delete copy[field];
      return copy;
    });
  };

  const validateField = (field, value) => {
    switch (field) {
      case "gender":
        if (!value) {
          setFieldError(field, "Gender required");
          return false;
        }
        break;

      case "dob":
        if (!value || !validateAge()) {
          setFieldError(field, "Minimum age 18 years");
          return false;
        }
        break;

      case "location":
        if (!value.trim()) {
          setFieldError(field, "Location required");
          return false;
        }
        break;

      case "address":
        if (value.trim().length < 10) {
          setFieldError(field, "Minimum 10 characters");
          return false;
        }
        break;

      case "aadhaar":
        const raw = value.replace(/\D/g, "");

        if (raw.length !== 12 || !validAadhaar(raw)) {
          setFieldError(field, "Invalid Aadhaar");
          return false;
        }

        break;

      default:
        break;
    }

    clearFieldError(field);

    return true;
  };

  /* ---------------- City Search ---------------- */

  useEffect(() => {
    if (location.length < 2) {
      setCitySuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&namePrefix=${location}`
        );

        if (!res.ok) return;

        const data = await res.json();

        setCitySuggestions(data.data || []);
      } catch (e) {
        console.log(e);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [location]);

  /* ---------------- Camera ---------------- */

  const openCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStream(media);
      setCameraOn(true);
    } catch {
      setError("Camera unavailable");
    }
  };

  useEffect(() => {
    if (cameraOn && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOn, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    setStream(null);
    setCameraOn(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;

    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      setCapturedImage(blob);
    }, "image/png");

    stopCamera();
  };

  /* ---------------- Upload ---------------- */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Upload valid image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Max 10MB");
      return;
    }

    setCapturedImage(file);

    setError("");
  };

  /* ---------------- Continue ---------------- */

  const handleContinue = () => {
    const valid =
      validateField("gender", gender) &&
      validateField("dob", dob) &&
      validateField("location", location) &&
      validateField("address", address) &&
      validateField("aadhaar", aadhaar);

    if (!valid) return;

    if (!capturedImage) {
      setError("Upload profile photo");
      return;
    }

    setProfileData({
      gender,

      dob,

      aadhar_number: aadhaar.replace(/\D/g, ""),

      profile_photo: capturedImage,

      location,

      address,
    });

    onNext();
  };

  return (
    <>
      <style>{`

.form-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:22px;
}

.form-group{
margin-bottom:15px;
}

label{
display:block;
margin-bottom:8px;
font-weight:600;
}

input,
select,
textarea{
width:100%;
padding:14px 16px;
border:1px solid #ddd;
border-radius:12px;
font-size:15px;
}

textarea{
min-height:120px;
resize:none;
}

input:focus,
select:focus,
textarea:focus{
outline:none;
border-color:#2f6fff;
box-shadow:0 0 0 3px rgba(47,111,255,.08);
}

.field-error{
color:#dc2626;
font-size:12px;
margin-top:6px;
}

.upload-box{
margin-top:30px;
background:#eef4ff;
padding:30px;
border-radius:24px;
}

.upload-choice{
display:flex;
gap:25px;
justify-content:center;
flex-wrap:wrap;
}

.upload-card{
width:220px;
height:170px;
background:#fff;
border-radius:20px;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
cursor:pointer;
box-shadow:0 8px 25px rgba(0,0,0,.07);
}

.upload-card.dark{
background:#111;
color:#fff;
}

.upload-icon{
width:65px;
margin-bottom:10px;
}

.city-list{
background:#fff;
margin-top:8px;
border-radius:12px;
overflow:hidden;
box-shadow:0 8px 20px rgba(0,0,0,.08);
}

.city-item{
padding:10px 14px;
cursor:pointer;
}

.city-item:hover{
background:#eef4ff;
}

.preview-modern{
text-align:center;
}

.preview-modern img{
width:160px;
height:160px;
border-radius:50%;
object-fit:cover;
}

.preview-actions{
display:flex;
justify-content:center;
gap:15px;
margin-top:20px;
}

.change-btn{
background:#dbe8ff;
border:none;
padding:13px 22px;
border-radius:12px;
}

.continue-btn{
background:#2f6fff;
border:none;
color:#fff;
padding:13px 24px;
border-radius:12px;
}

.error-msg{
margin-top:20px;
padding:14px;
background:#fee2e2;
color:#dc2626;
border-radius:12px;
text-align:center;
font-weight:600;
}

@media(max-width:768px){
.form-grid{
grid-template-columns:1fr;
}
}

`}</style>

      <div className="pc-step-content">
        <div className="StepIdentity modern-card">
          <p className="id-para">We are now creating your profile</p>

          <div className="form-grid">
            <div className="form-group">
              <label>Gender *</label>

              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  validateField("gender", e.target.value);
                }}
              >
                <option value="">Select</option>

                <option>Male</option>

                <option>Female</option>

                <option>Other</option>
              </select>

              {errors.gender && <p className="field-error">{errors.gender}</p>}
            </div>

            <div className="form-group">
              <label>DOB *</label>

              <input
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  validateField("dob", e.target.value);
                }}
              />

              {errors.dob && <p className="field-error">{errors.dob}</p>}
            </div>

            <div className="form-group">
              <label>Location *</label>

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => validateField("location", location)}
              />

              {citySuggestions.length > 0 && (
                <div className="city-list">
                  {citySuggestions.map((city, i) => (
                    <div
                      key={i}
                      className="city-item"
                      onClick={() => {
                        setLocation(`${city.city}, ${city.country}`);
                        setCitySuggestions([]);
                      }}
                    >
                      {city.city}, {city.country}
                    </div>
                  ))}
                </div>
              )}

              {errors.location && (
                <p className="field-error">{errors.location}</p>
              )}
            </div>

            <div className="form-group">
              <label>Aadhaar *</label>

              <input
                value={aadhaar}
                placeholder="XXXX-XXXX-XXXX"
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");

                  if (v.length > 12) return;

                  v = v.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
                    [a, b, c].filter(Boolean).join("-")
                  );

                  setAadhaar(v);
                }}
                onBlur={() => validateField("aadhaar", aadhaar)}
              />

              {errors.aadhaar && (
                <p className="field-error">{errors.aadhaar}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => validateField("address", address)}
            />

            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>

          <div className="upload-box">
            {!cameraOn && !capturedImage && (
              <div className="upload-choice">
                <div
                  className="upload-card"
                  onClick={() => fileInputRef.current.click()}
                >
                  <img src={cam} className="upload-icon" alt="" />

                  <div>Upload Photo</div>
                </div>

                <div className="upload-card dark" onClick={openCamera}>
                  <div style={{ fontSize: 50 }}>📷</div>

                  <div>Use Camera</div>
                </div>

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            )}

            {cameraOn && (
              <div className="preview-modern">
                <video
                  ref={videoRef}
                  autoPlay
                  style={{
                    maxWidth: "480px",
                    borderRadius: "18px",
                  }}
                />

                <div className="preview-actions">
                  <button className="continue-btn" onClick={capturePhoto}>
                    Capture
                  </button>
                </div>
              </div>
            )}

            {capturedImage && !cameraOn && (
              <div className="preview-modern">
                <img src={previewUrl} alt="" />

                <div className="preview-actions">
                  <button
                    className="change-btn"
                    onClick={() => setCapturedImage(null)}
                  >
                    Change Photo
                  </button>

                  <button className="continue-btn" onClick={handleContinue}>
                    Continue →
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <canvas
            ref={canvasRef}
            style={{
              display: "none",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default StepIdentity;
