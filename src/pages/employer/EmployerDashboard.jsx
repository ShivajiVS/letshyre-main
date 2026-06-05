import { useEffect, useState } from "react";
import api from "@/services/api";

import { useEmployerDashboardStats } from "@/hooks/employer/useDashboard";
import DashboardTopCards from "./components/dashboard/DashboardTopCards";
import CreditUsageCard from "./components/dashboard/CreditUsageCard";

import robo from "@/assets/emp-robo.png";

import "./empSubSections.css";

export function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);

  const { data: stats, isLoading } = useEmployerDashboardStats();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // ✅ Jobs
      const jobRes = await api.get("/user/v1/employer_jobs/");
      const jobsData = jobRes.data?.data.results || [];
      setJobs(jobsData);
    } catch (err) {
      console.error("Dashboard API error:", err);
    }
  };

  // ================= CALCULATIONS =================
  const metrics = jobs.slice(0, 5).map((job) => ({
    label: job.title?.slice(0, 6) || "Job",
    value: job.applicants_count || 20,
    job: job.title,
  }));

  return (
    <div className="ds-main">
      <div className="ds-sub-box01">
        <DashboardTopCards stats={stats} isLoading={isLoading} />
      </div>

      {/* ================= METRICS ================= */}
      <div className="ds-sub-box02">
        <div className="ds-sub-inner02">
          <div className="sc-metrics-card">
            <div className="ds-graph-header">
              <h4>AI Match Distribution</h4>
              <div className="ds-hpm-filter">
                <i className="bi bi-filter"></i>
                <span>Live</span>
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>

            <div className="sc-chart-area">
              <div className="sc-y-axis">
                {[100, 80, 60, 40, 20, 0].map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>

              <div className="sc-bar-chart">
                {metrics.map((item, i) => (
                  <div className="sc-bar-item" key={i}>
                    <div className="sc-tooltip">{item.job}</div>
                    <div
                      className="sc-bar-container"
                      style={{ height: `${item.value}%` }}
                    >
                      <div className="sc-bar" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sc-bar-label">
              {metrics.map((item, i) => (
                <span key={i}>{item.label}</span>
              ))}
            </div>

            <p className="sc-subtitle">Here are all the jobs that you posted</p>
          </div>
        </div>

        {/* ================= CREDITS ================= */}
        <CreditUsageCard credits={stats?.credits} isLoading={isLoading} />
        {/*
        <div className="ds-sub-inner02">
          <div className="ds-credit-card">
            <h3>Team Credit Usage</h3>

            <div className="ds-team-list">
              {teamUsage && teamUsage.length > 0 ? (
                teamUsage.map((user, index) => (
                <div key={index} className="ds-team-item d-flex justify-content-between">
                  <span className="ds-user-name">👤 {user.name}</span>
                  <span className="ds-user-credits">{user.credits} credits</span>
                </div>
                ))
              ) : (
                <p>No usage data available</p>
              )}
            </div>
          </div>
        </div>
      */}
      </div>

      {/* ================= MATCH LIST ================= */}
      <div className="ds-sub-box03">
        <div className="ds-sub-inner03 ds-hpm-card">
          <div className="ds-hpm-header">
            <h4>High Potential Matches</h4>
            <div className="ds-hpm-filter">
              <i className="bi bi-filter"></i>
              <span>All Jobs</span>
              <i className="bi bi-chevron-down"></i>
            </div>
          </div>

          <div className="ds-hpm-list">
            {jobs.slice(0, 5).map((job, i) => (
              <div className="ds-hpm-item" key={i}>
                <div className="ds-hpm-left">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="profile"
                  />
                  <div>
                    <h4>{job.title}</h4>
                    <p>{job.location}</p>
                  </div>
                </div>

                <div className="ds-hpm-right">
                  <p>Applicants</p>
                  <div className="ds-progress">
                    <div
                      className="ds-progress-bar"
                      style={{
                        width: `${job.applicants_count || 50}%`,
                      }}
                    ></div>
                  </div>

                  <span className="ds-score">{job.applicants_count || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="ds-sub-inner03 ds-ai-card">
          <div className="ds-ai-outer-content">
            <div className="ds-ai-content">
              <h2>
                Our AI Will <br />
                Simplify <br />
                everything <br />
                for you
              </h2>

              <img src={robo} alt="ai" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
