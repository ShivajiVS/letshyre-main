import React from "react";
import upload_img from "@/assets/dragNdrop.png";

export function JdUploadSection({
  fileName,
  jdJobTitle,
  setJdJobTitle,
  handleClick,
  handleJdUpload,
  isPending,
  fileInputRef,
  handleFileChange,
  selectedFile
}) {
  const handleViewFile = () => {
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className={`emp-post-job-upload ${fileName ? 'jd-upload-step-active' : ''}`}>
      {fileName ? (
          <div className="jd-unified-card">
          {/* Top Section: File Info & Actions */}
          <div className="jd-unified-header">
            <div className="jd-file-header">
              <div className="jd-file-icon-box">
                <i className="bi bi-file-earmark-text-fill jd-file-icon"></i>
              </div>
              <div className="jd-file-details">
                <span className="jd-file-name" title={fileName}>{fileName}</span>
                <span className="jd-file-status">
                  <i className="bi bi-check-circle-fill"></i> Ready for analysis
                </span>
              </div>
            </div>
            <div className="jd-file-actions">
              <button 
                className="jd-file-action-btn" 
                onClick={handleViewFile} 
                title="View File"
              >
                <i className="bi bi-eye"></i> View
              </button>
              <button 
                className="jd-file-action-btn" 
                onClick={handleClick} 
                disabled={isPending} 
                title="Replace File"
              >
                <i className="bi bi-arrow-repeat"></i> Replace
              </button>
            </div>
          </div>

          <hr className="jd-unified-divider" />

          {/* Middle Section: Job Title Input */}
          <div className="jd-unified-body">
            <div className="jd-title-input-box">
              <label>Confirm Job Title</label>
              <input 
                type="text" 
                placeholder="e.g. Full Stack Engineer"
                value={jdJobTitle}
                onChange={(e) => setJdJobTitle(e.target.value)}
                className="jd-title-input"
              />
            </div>
          </div>

          {/* Bottom Section: Primary Action */}
          <div className="jd-unified-footer">
            <button 
              className={`emp-btn-primary jd-analyze-btn ${isPending ? 'analyzing-active' : ''}`} 
              onClick={handleJdUpload} 
              disabled={isPending || !jdJobTitle.trim()}
            >
              {isPending ? (
                <span className="jd-loading-shimmer-text">
                  <i className="bi bi-arrow-repeat jd-spin-icon" style={{marginRight: '8px', display: 'inline-block'}}></i>
                  Extracting JD Information...
                </span>
              ) : (
                <>
                  <i className="bi bi-stars"></i> Analyze JD
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <img
            src={upload_img}
            onClick={handleClick}
            alt="Upload"
            style={{ cursor: "pointer", marginBottom: "15px" }}
          />
          <h3>Drag & Drop your file here</h3>
          <p>or</p>
          <button className="emp-upload-btn" onClick={handleClick}>
            Choose File
          </button>
        </>
      )}
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
    </div>
  );
}
