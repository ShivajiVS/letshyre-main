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
  handleFileChange
}) {
  return (
    <div className="emp-post-job-upload">
      <img
        src={upload_img}
        onClick={handleClick}
        alt="Upload"
        style={{ cursor: "pointer" }}
      />

      {fileName ? (
        <div className="jd-upload-active">
          <p className="file-name-success">{fileName}</p>
          
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
            <button className="emp-btn-outline" onClick={handleClick} disabled={isPending}>
              Replace File
            </button>
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
