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
    <div className="emp-post-job-upload">
      {fileName ? (
        <div className="jd-upload-active">
          <div className="jd-file-highlight">
            <div className="jd-file-header">
              <div className="jd-file-icon-box">
                <i className="bi bi-file-earmark-text-fill jd-file-icon"></i>
              </div>
              <div className="jd-file-details">
                <span className="jd-file-name" title={fileName}>{fileName}</span>
                <span className="jd-file-status">Ready for analysis</span>
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
          
          <div className="jd-title-input-box">
            <label>What is the Job Title?</label>
            <input 
              type="text" 
              placeholder="e.g. Full Stack Engineer"
              value={jdJobTitle}
              onChange={(e) => setJdJobTitle(e.target.value)}
              className="jd-title-input"
            />
          </div>

          <div className="jd-upload-actions">
            {/* Replace button was moved inline with the file name */}
            <button className="emp-btn-primary" onClick={handleJdUpload} disabled={isPending || !jdJobTitle.trim()}>
              {isPending ? (
                <>
                  <span className="jd-spinner"></span>
                  Analyzing...
                </>
              ) : (
                "Analyze JD"
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
