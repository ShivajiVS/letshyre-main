import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import logo from "@/assets/logo2.png";
import EmployeeLockedOverlay from "@/components/layout/EmployeeLockedOverlay";
import EmployeeRightPanelForJobs from "./EmployeeRightPanelForJobs";
import ProfileStatusModal from "./ProfileStatusModal";
import LogoutModal from "./LogoutModal";
import ProfileCompletion from "@/pages/employee/components/profile/ProfileCompletion";

import { useEmployeeLogout } from "@/hooks/employee/useEmployeeLogout";
import {
  useCandidateProfile,
  CANDIDATE_PROFILE_KEY,
} from "@/hooks/useCandidateProfile";

import "./styles/employee-dashboard-layout.css";

export function EmployeeDashboardLayout() {
  const [showProfileFlow, setShowProfileFlow] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useCandidateProfile();
  const isApproved = userData?.is_approved;

  const profileCompleted = userData?.is_profile_complete === true;

  const handleProfileComplete = () => {
    queryClient.invalidateQueries({ queryKey: CANDIDATE_PROFILE_KEY });
    setShowProfileFlow(false);
  };

  const { mutate: performLogout, isPending: isLoggingOut } =
    useEmployeeLogout();

  const getPageTitle = () => {
    if (location.pathname.includes("profile"))
      return (
        <>
          Your <span>Profile</span>
        </>
      );
    if (location.pathname.includes("applications"))
      return (
        <>
          My <span>Applications</span>
        </>
      );
    if (location.pathname.includes("score-card"))
      return (
        <>
          Your <span>Scorecard</span>
        </>
      );
    return (
      <>
        Explore<span> Jobs</span>
      </>
    );
  };

  if (isLoading) {
    const shimmerStyle = {
      background: "linear-gradient(90deg,#e8eef7 25%,#d5e0f0 50%,#e8eef7 75%)",
      backgroundSize: "600px 100%",
      animation: "sk-shimmer 1.4s ease-in-out infinite",
    };

    return (
      <div className="cd-page">
        <div className="cd-dashboard">
          <aside className="cd-sidebar">
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  ...shimmerStyle,
                  width: "120px",
                  height: "30px",
                  borderRadius: "8px",
                  marginBottom: "40px",
                }}
              />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...shimmerStyle,
                    width: "100%",
                    height: "48px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                  }}
                />
              ))}
            </div>
          </aside>
          <main className="cd-main">
            <div
              className="cd-topbar"
              style={{
                padding: "0 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "72px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  ...shimmerStyle,
                  width: "200px",
                  height: "24px",
                  borderRadius: "6px",
                }}
              />
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <div
                  style={{
                    ...shimmerStyle,
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    ...shimmerStyle,
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </div>
            <div className="cd-content" style={{ padding: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "24px",
                  marginBottom: "24px",
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...shimmerStyle,
                      height: "140px",
                      borderRadius: "20px",
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  ...shimmerStyle,
                  width: "100%",
                  height: "300px",
                  borderRadius: "24px",
                }}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-page">
      <div className={`cd-dashboard ${!profileCompleted ? "cd-dimmed" : ""}`}>
        {/* LEFT SIDEBAR */}
        <aside className={`cd-sidebar ${mobileMenuOpen ? "open" : ""}`}>
          <div className="ls-logo-text cd-logo">
            <img src={logo} alt="Letshyre logo" className="logo" />
            <div
              className="cd-sidebar-close"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </div>
          </div>

          <ul className="cd-menu">
            <li>
              <NavLink
                to="/employee/find-jobs"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="bi bi-suitcase-lg"></i> Find Jobs
              </NavLink>
            </li>

            <li className={!profileCompleted ? "locked" : ""}>
              <NavLink
                to={profileCompleted ? "/employee/my-applications" : "#"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="bi bi-file-earmark-text"></i> My Applications
              </NavLink>
            </li>

            <li className={!profileCompleted ? "locked" : ""}>
              <NavLink
                to={profileCompleted ? "/employee/score-cards-list" : "#"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="bi bi-file-earmark-text"></i> Scorecard
              </NavLink>
            </li>

            <li className="mobile-only-menu">
              <NavLink
                to="/employee/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="bi bi-person"></i> Profile
              </NavLink>
            </li>

            <li
              className="logout"
              onClick={() => {
                setShowLogoutModal(true);
                setMobileMenuOpen(false);
              }}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </li>
          </ul>
        </aside>

        {mobileMenuOpen && (
          <div
            className="cd-sidebar-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="cd-main">
          <header className="cd-topbar">
            <div className="cd-mobile-left">
              <img src={logo} className="cd-mobile-logo" alt="logo" />
            </div>

            <h2 className="cd-page-title">{getPageTitle()}</h2>

            <div className="cd-topbar-right">
              <div
                className="cd-user"
                onClick={() => navigate("/employee/profile")}
                role="button"
                tabIndex={0}
                aria-label="Open profile"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate("/employee/profile");
                  }
                }}
              >
                <div className="cd-user-avatar-wrap">
                  <img
                    src={userData?.profile_photo || ""}
                    alt="user"
                    className="cd-user-avatar"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        userData?.name || "User",
                      )}`;
                    }}
                  />
                  <span className="cd-user-status"></span>
                </div>

                <div className="cd-user-info">
                  <span className="cd-user-name">
                    {userData?.name || "User"}
                  </span>
                </div>

                <i className="bi bi-chevron-right cd-user-arrow"></i>
              </div>
              <button
                className="cd-hamburger"
                onClick={() => setMobileMenuOpen(true)}
              >
                <i className="bi bi-list" />
              </button>
            </div>
          </header>

          <div
            className={`cd-main-grid ${
              location.pathname.includes("find-jobs") ||
              location.pathname === "/employee"
                ? "profile-full"
                : ""
            }`}
          >
            <section className="cd-center">
              <Outlet />
            </section>
            {/* RIGHT PANEL */}
            {(location.pathname.includes("find-jobs") ||
              location.pathname === "/employee") && (
              <EmployeeRightPanelForJobs profile={userData} />
            )}
          </div>
        </main>
      </div>

      {/* OVERLAYS & MODALS */}
      {userData && !profileCompleted && !showProfileFlow && (
        <EmployeeLockedOverlay onAction={() => setShowProfileFlow(true)} />
      )}

      {userData && !profileCompleted && showProfileFlow && (
        <div className="cd-overlay">
          <div className="cd-popup-card">
            <ProfileCompletion onComplete={handleProfileComplete} />
          </div>
        </div>
      )}

      {userData && (!isApproved || userData?.is_rejected === true) && (
        <ProfileStatusModal
          isRejected={userData?.is_rejected === true}
          rejectionReason={userData?.reject_reason}
          onLogout={() => performLogout()}
          isLoggingOut={isLoggingOut}
        />
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => performLogout()}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}
