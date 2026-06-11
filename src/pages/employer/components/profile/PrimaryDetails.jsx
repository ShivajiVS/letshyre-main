import React from "react";

export const PrimaryDetails = ({ profile, kyc, loggedUser }) => {
  const val = (field) => {
    if (field === null || field === undefined || field === "") {
      return "NA";
    }
    return field;
  };

  return (
    <section className="ep-card" aria-labelledby="primary-details-heading">
      <h3 id="primary-details-heading" className="ep-heading">
        Primary Details
      </h3>
      <div className="ep-grid">
        <div className="ep-grid-col">
          <div className="ep-grid-item">
            <i className="bi bi-person ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Name</span>
              <p className="ep-value">{val(profile?.name || profile?.full_name || loggedUser?.name)}</p>
            </div>
          </div>
          <div className="ep-grid-item">
            <i className="bi bi-briefcase ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Industry</span>
              <p className="ep-value">{val(kyc?.company_industry)}</p>
            </div>
          </div>
        </div>

        <div className="ep-grid-col">
          <div className="ep-grid-item">
            <i className="bi bi-envelope ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Email</span>
              <p className="ep-value">{val(profile?.email || loggedUser?.email)}</p>
            </div>
          </div>
          <div className="ep-grid-item">
            <i className="bi bi-telephone ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Phone</span>
              <p className="ep-value">{val(profile?.phone_number || profile?.phone || loggedUser?.phone_number)}</p>
            </div>
          </div>
        </div>

        <div className="ep-grid-col">
          <div className="ep-grid-item">
            <i className="bi bi-envelope-check ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">Official Email</span>
              <p className="ep-value">{val(kyc?.official_email || loggedUser?.official_email)}</p>
            </div>
          </div>
          <div className="ep-grid-item">
            <i className="bi bi-shield-check ep-icon" aria-hidden="true"></i>
            <div>
              <span className="ep-label">KYC Status</span>
              <p className="ep-value">
                <span className={`ep-status ep-status-${kyc?.kyc_status?.toLowerCase() || 'pending'}`}>
                  {val(kyc?.kyc_status)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
