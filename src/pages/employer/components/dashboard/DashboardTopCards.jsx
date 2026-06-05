import React from 'react';
import ds01 from "@/assets/emp-ds01.png";
import ds02 from "@/assets/emp-ds02.png";
import ds03 from "@/assets/emp-ds03.png";
import DashboardStatsSkeleton from './DashboardStatsSkeleton';

const DashboardTopCards = ({ stats, isLoading }) => {
  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <>
      {/* ================= ACTIVE JOBS ================= */}
      <div className="ds-sub-inner01">
        <div className="ds-card-header">Active Jobs</div>

        <div className="ds-card-body">
          <div className="ds-card-left">
            <div className="ds-icon">
              <i className="bi bi-suitcase"></i>
            </div>
          </div>

          <div className="ds-card-center">
            <h2>{stats?.active_jobs || 0}</h2>
            <p>/Currently active</p>
          </div>

          <div className="ds-card-right">
            <div className="ds-bars">
              <img src={ds01} alt="Chart" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= IN-ACTIVE JOBS ================= */}
      <div className="ds-sub-inner01">
        <div className="ds-card-header">In-Active Jobs</div>

        <div className="ds-card-body">
          <div className="ds-card-left">
            <div className="ds-icon">
              <i className="bi bi-suitcase-fill"></i>
            </div>
          </div>

          <div className="ds-card-center">
            <h2>{stats?.in_active_jobs || 0}</h2>
            <p>/Closed or Draft</p>
          </div>

          <div className="ds-card-right">
            <div className="ds-bars">
              <img src={ds01} alt="Chart" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TOTAL APPLICANTS ================= */}
      <div className="ds-sub-inner01">
        <div className="ds-card-header">Total Applicants</div>

        <div className="ds-card-body">
          <div className="ds-card-left">
            <div className="ds-icon">
              <i className="bi bi-people"></i>
            </div>
          </div>

          <div className="ds-card-center">
            <h2>{stats?.total_applicants || 0}</h2>
            <p>/Unique applicants</p>
          </div>

          <div className="ds-card-right">
            <div className="ds-bars">
              <img src={ds02} alt="Chart" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TOTAL APPLICATIONS ================= */}
      <div className="ds-sub-inner01">
        <div className="ds-card-header">Total Applications</div>

        <div className="ds-card-body">
          <div className="ds-card-left">
            <div className="ds-icon">
              <i className="bi bi-file-earmark-person"></i>
            </div>
          </div>

          <div className="ds-card-center">
            <h2>{stats?.total_applications || 0}</h2>
            <p>/Total received</p>
          </div>

          <div className="ds-card-right">
            <div className="ds-bars">
              <img src={ds03} alt="Chart" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTopCards;
