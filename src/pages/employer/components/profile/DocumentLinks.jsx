import React from "react";

export const DocumentLinks = ({ kyc }) => {
  const renderDocLink = (label, url, icon) => {
    if (!url) return null;
    return (
      <a href={url} target="_blank" rel="noreferrer" className="ep-doc-card">
        <div className="ep-doc-icon-wrapper">
          <i className={`bi ${icon} ep-doc-icon`}></i>
        </div>
        <div className="ep-doc-info">
          <span className="ep-doc-label">{label}</span>
          <span className="ep-doc-action">View Document <i className="bi bi-box-arrow-up-right"></i></span>
        </div>
      </a>
    );
  };

  // If no docs uploaded, return null
  if (
    !kyc?.registration_certificate &&
    !kyc?.gst_certificate &&
    !kyc?.address_proof &&
    !kyc?.bank_proof
  ) {
    return null;
  }

  return (
    <section className="ep-card" aria-labelledby="documents-heading">
      <h3 id="documents-heading" className="ep-heading">
        Uploaded Documents
      </h3>
      <div className="ep-doc-grid">
        {renderDocLink("Registration Certificate", kyc?.registration_certificate, "bi-file-earmark-text")}
        {renderDocLink("GST Certificate", kyc?.gst_certificate, "bi-file-earmark-check")}
        {renderDocLink("Address Proof", kyc?.address_proof, "bi-file-earmark-person")}
        {renderDocLink("Bank Proof", kyc?.bank_proof, "bi-file-earmark-medical")}
      </div>
    </section>
  );
};
