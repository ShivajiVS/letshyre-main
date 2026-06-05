import React from 'react';
import DashboardStatsSkeleton from './DashboardStatsSkeleton';
import './DashboardTopCards.css';

const ChartPlaceholder = ({ bars }) => (
  <div className="custom-dash-chart">
    <div className="custom-bar-item">
      <div className="custom-bar" style={{ height: `${bars[0]}px` }}></div>
      <span className="custom-bar-label">Dec</span>
    </div>
    <div className="custom-bar-item">
      <div className="custom-bar" style={{ height: `${bars[1]}px` }}></div>
      <span className="custom-bar-label">Jan</span>
    </div>
    <div className="custom-bar-item">
      <div className="custom-bar" style={{ height: `${bars[2]}px` }}></div>
      <span className="custom-bar-label">Feb</span>
    </div>
    <div className="custom-bar-item">
      <div className="custom-bar" style={{ height: `${bars[3]}px` }}></div>
      <span className="custom-bar-label">Mar</span>
    </div>
  </div>
);

const DashboardTopCards = ({ stats, isLoading }) => {
  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <>
      {/* ================= ACTIVE JOBS ================= */}
      <div className="custom-dash-card">
        <div className="custom-dash-card-header">Active Jobs</div>
        <div className="custom-dash-card-body">
          <div className="custom-dash-left">
            <div className="custom-dash-icon">
              <i className="bi bi-briefcase"></i>
            </div>
            <div className="custom-dash-center">
              <h2>{stats?.active_jobs || 0}</h2>
              <p>
                <span>/Currently</span>
                <span>active</span>
              </p>
            </div>
          </div>
          <div className="custom-dash-right">
            <ChartPlaceholder bars={[16, 40, 24, 32]} />
          </div>
        </div>
      </div>

      {/* ================= IN-ACTIVE JOBS ================= */}
      <div className="custom-dash-card">
        <div className="custom-dash-card-header">In-Active Jobs</div>
        <div className="custom-dash-card-body">
          <div className="custom-dash-left">
            <div className="custom-dash-icon">
              <i className="bi bi-briefcase-fill"></i>
            </div>
            <div className="custom-dash-center">
              <h2>{stats?.in_active_jobs || 0}</h2>
              <p>
                <span>/Closed or</span>
                <span>Draft</span>
              </p>
            </div>
          </div>
          <div className="custom-dash-right">
            <ChartPlaceholder bars={[32, 16, 40, 24]} />
          </div>
        </div>
      </div>

      {/* ================= TOTAL APPLICANTS ================= */}
      <div className="custom-dash-card">
        <div className="custom-dash-card-header">Total Applicants</div>
        <div className="custom-dash-card-body">
          <div className="custom-dash-left">
            <div className="custom-dash-icon">
              <i className="bi bi-people"></i>
            </div>
            <div className="custom-dash-center">
              <h2>{stats?.total_applicants || 0}</h2>
              <p>
                <span>/Unique</span>
                <span>applicants</span>
              </p>
            </div>
          </div>
          <div className="custom-dash-right">
            <ChartPlaceholder bars={[24, 40, 16, 32]} />
          </div>
        </div>
      </div>

      {/* ================= TOTAL APPLICATIONS ================= */}
      <div className="custom-dash-card">
        <div className="custom-dash-card-header">Total Applications</div>
        <div className="custom-dash-card-body">
          <div className="custom-dash-left">
            <div className="custom-dash-icon">
              <i className="bi bi-file-earmark-person"></i>
            </div>
            <div className="custom-dash-center">
              <h2>{stats?.total_applications || 0}</h2>
              <p>
                <span>/Total</span>
                <span>received</span>
              </p>
            </div>
          </div>
          <div className="custom-dash-right">
            <ChartPlaceholder bars={[40, 24, 32, 16]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTopCards;

