import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";

import logo from "@/assets/logo2.png";
import logoutImg from "@/assets/logout.png";

import { logoutMe } from "@/services/auth.service";
import LockedOverlay from "@/components/dashboard/LockedOverlay";
import ProfileCompletion from "@/components/profile/ProfileCompletion";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import EmployeeRightPanelForJobs from "./EmployeeRightPanelForJobs";
import "./styles/employee-dashboard-layout.css";

export function EmployeeDashboardLayout() {
  const [showProfileFlow, setShowProfileFlow] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { data: userData, isLoading } = useCandidateProfile();

  const profileCompleted = userData?.is_profile_complete === true;

  const handleProfileComplete = () => {
    localStorage.setItem("profileCompleted", "true");
    setShowProfileFlow(false);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logoutMe();
    setTimeout(() => {
      localStorage.removeItem("user");
      navigate("/employee/sign-in", { replace: true });
    }, 800);
  };

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
    return (
      <div className="cd-page">
        <div className="cd-dashboard">
          <aside className="cd-sidebar" />
          <main className="cd-main">
            <div
              className="cd-topbar"
              style={{
                background:
                  "linear-gradient(90deg,#e8eef7 25%,#d5e0f0 50%,#e8eef7 75%)",
                backgroundSize: "600px 100%",
                animation: "sk-shimmer 1.4s ease-in-out infinite",
                minHeight: "72px",
              }}
            />
            <div
              style={{
                borderRadius: "26px",
                background:
                  "linear-gradient(90deg,#e8eef7 25%,#d5e0f0 50%,#e8eef7 75%)",
                backgroundSize: "600px 100%",
                animation: "sk-shimmer 1.4s ease-in-out infinite",
                minHeight: "420px",
              }}
            />
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
            <div
              className="cd-sidebar-close"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </div>
            <img src={logo} alt="Letshyre logo" className="logo" />
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
        <LockedOverlay onAction={() => setShowProfileFlow(true)} />
      )}

      {userData && !profileCompleted && showProfileFlow && (
        <div className="cd-overlay">
          <div className="cd-popup-card">
            <ProfileCompletion onComplete={handleProfileComplete} />
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div
          className="logout-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="logout-close"
              onClick={() => setShowLogoutModal(false)}
            >
              <i className="bi bi-x-lg"></i>
            </div>
            <img src={logoutImg} alt="Logout" className="logout-img" />
            <h3>Oh no, you're leaving</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-actions">
              <button
                className="logout-no"
                onClick={() => setShowLogoutModal(false)}
              >
                Naah!
              </button>
              <button className="logout-yes" onClick={handleLogout}>
                Yes, Log me out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
