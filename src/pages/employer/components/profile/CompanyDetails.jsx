import React from "react";

export const CompanyDetails = ({ kyc }) => {
  const val = (field) => {
    if (field === null || field === undefined || field === "") {
      return "NA";
    }
    return field;
  };

  return (
    <section className="ep-card" aria-labelledby="company-details-heading">
      <h3 id="company-details-heading" className="ep-heading">
        Company Details
      </h3>
      <div className="ep-grid">
        <div className="ep-grid-col">
          <div className="ep-grid-item">
            <i className="bi bi-building ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Company Name</span>
              <p className="ep-value">{val(kyc?.company_name)}</p>
            </div>
          </div>
          <div className="ep-grid-item">
            <i className="bi bi-globe ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Website</span>
              <p className="ep-value">
                {kyc?.company_website ? (
                  <a href={kyc.company_website} target="_blank" rel="noreferrer" className="ep-link">
                    {kyc.company_website}
                  </a>
                ) : (
                  "NA"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="ep-grid-col">
          <div className="ep-grid-item">
            <i className="bi bi-card-text ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Registration Number</span>
              <p className="ep-value">{val(kyc?.company_registration_number)}</p>
            </div>
          </div>
          <div className="ep-grid-item">
            <i className="bi bi-receipt ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">GST Number</span>
              <p className="ep-value">{val(kyc?.gst_number)}</p>
            </div>
          </div>
        </div>

        <div className="ep-grid-col">
          <div className="ep-grid-item">
            <i className="bi bi-credit-card ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">PAN Number</span>
              <p className="ep-value">{val(kyc?.pan_number)}</p>
            </div>
          </div>
          <div className="ep-grid-item">
            <i className="bi bi-geo-alt ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Address</span>
              <p className="ep-value">{val(kyc?.company_address)}</p>
            </div>
          </div>
        </div>

        <div className="ep-grid-col">

          <div className="ep-grid-item">
            <i className="bi bi-linkedin ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">LinkedIn</span>
              <p className="ep-value">
                {kyc?.linkedin_url ? (
                  <a href={kyc.linkedin_url} target="_blank" rel="noreferrer" className="ep-link">
                    View Profile
                  </a>
                ) : (
                  "NA"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="ep-grid-col ep-col-span-full">
          <div className="ep-grid-item ep-grid-item-full">
            <i className="bi bi-info-circle ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Description</span>
              <p className="ep-value ep-description">{val(kyc?.company_description)}</p>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};
