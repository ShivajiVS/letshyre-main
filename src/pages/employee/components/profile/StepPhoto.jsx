import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import cam from "@/assets/cam01.png";

function StepPhoto({ onNext, onBack }) {
  const { setValue, watch } = useFormContext();

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState("");
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const profilePhoto = watch("profile_photo");

  useEffect(() => {
    if (profilePhoto && typeof profilePhoto !== "string") {
      const url = URL.createObjectURL(profilePhoto);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof profilePhoto === "string") {
      setPreviewUrl(profilePhoto);
    }
  }, [profilePhoto]);

  const openCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(media);
      setCameraOn(true);
    } catch {
      setPhotoError("Camera unavailable");
    }
  };

  useEffect(() => {
    if (cameraOn && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOn, stream]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
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
      const file = new File([blob], "profile_photo.png", { type: "image/png" });
      setValue("profile_photo", file);
      setPhotoError("");
    }, "image/png");
    stopCamera();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Upload valid image");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Max 10MB");
      return;
    }
    setValue("profile_photo", file);
    setPhotoError("");
  };

  const handleContinue = () => {
    if (!profilePhoto) {
      setPhotoError("Please upload a profile photo to continue");
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="pc-step-content"
    >
      <style>{`
        .upload-section {
          background: #f8fafc;
          border-radius: var(--pc-radius-lg);
          padding: 32px;
          border: 1px dashed var(--pc-border);
          text-align: center;
        }
        .upload-choices {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .upload-card {
          width: 200px;
          height: 180px;
          background: #ffffff;
          border-radius: var(--pc-radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--pc-shadow-soft);
          transition: all 0.3s ease;
          border: 1px solid var(--pc-border);
        }
        .upload-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--pc-shadow-hover);
          border-color: var(--pc-secondary);
        }
        .upload-card.dark {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }
        .upload-icon {
          width: 60px;
          margin-bottom: 16px;
        }
        .camera-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }
        .preview-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .preview-box img {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: var(--pc-shadow-soft);
          border: 4px solid #ffffff;
        }
      `}</style>

      <div className="upload-section">
        {!cameraOn && !profilePhoto && (
          <div className="upload-choices">
            <div
              className="upload-card"
              onClick={() => fileInputRef.current.click()}
            >
              <img src={cam} className="upload-icon" alt="Upload" />
              <div style={{ fontWeight: 600 }}>Upload Photo</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>PNG, JPG up to 10MB</div>
            </div>

            <div className="upload-card dark" onClick={openCamera}>
              <div className="camera-icon">📷</div>
              <div style={{ fontWeight: 600 }}>Take a Selfie</div>
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
          <div className="preview-box">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                maxWidth: "480px",
                aspectRatio: "4/3",
                objectFit: "cover",
                borderRadius: "var(--pc-radius-lg)",
                boxShadow: "var(--pc-shadow-soft)",
                border: "1px solid var(--pc-border)"
              }}
            />
            <div style={{ display: "flex", gap: "16px" }}>
              <button className="btn-secondary" onClick={stopCamera}>
                Cancel
              </button>
              <button className="btn-primary" onClick={capturePhoto}>
                Capture Photo
              </button>
            </div>
          </div>
        )}

        {profilePhoto && !cameraOn && (
          <div className="preview-box">
            <img src={previewUrl} alt="Profile Preview" />
            <div style={{ display: "flex", gap: "16px" }}>
              <button
                className="btn-secondary"
                onClick={() => setValue("profile_photo", null)}
              >
                Change Photo
              </button>
            </div>
          </div>
        )}
      </div>

      {photoError && <div className="error-msg" style={{ marginTop: 24 }}>{photoError}</div>}

      <div className="pc-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <button className="btn-primary" onClick={handleContinue}>
          Continue <i className="bi bi-arrow-right"></i>
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </motion.div>
  );
}

export default StepPhoto;
