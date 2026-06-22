import { useState, useEffect } from "react";
import { Joyride } from "react-joyride";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router";

import {
  useEmployerProfile,
  useEmployerCredits,
  useTeamMembers,
  useInviteTeamMember,
} from "@/hooks/employer/useDashboard";
import { logoutMe } from "@/services/auth.service";

import team01 from "@/assets/team01.png";
import logo from "@/assets/logo2.png";
import logout from "@/assets/logout.png";
import tour from "@/assets/Tour.png";
import overlay_img from "@/assets/unlock-img02.png";

import "./styles/employer-dashboard-layout.css";
import "@/components/layout/EmployeeLockedOverlay";

const MENU_ITEMS = [
  {
    id: "tour-dashboard",
    to: "/employer/dashboard",
    icon: "bi-grid",
    label: "Dashboard",
  },
  {
    id: "tour-postjob",
    to: "/employer/post-job",
    icon: "bi-briefcase",
    label: "Post Job",
  },
  {
    id: "tour-jobs",
    to: "/employer/view-jobs",
    icon: "bi-card-list",
    label: "View Jobs",
  },
  {
    id: "tour-candidates",
    to: "/employer/candidate-pool",
    icon: "bi-people-fill",
    label: "Candidate Pool",
  },
  {
    id: "tour-unlocked-candidates",
    to: "/employer/unlocked-candidates",
    icon: "bi-people-fill",
    label: "Unlocked Candidates",
  },

  {
    id: "tour-team",
    to: "/employer/your-team",
    icon: "bi-people",
    label: "Your Team",
  },
];

const SUB_ITEMS = [
  { to: "/employer/managing-subscriptions", icon: "bi-layers", label: "Plans" },
  {
    to: "/employer/invoice",
    icon: "bi-file-earmark-text",
    label: "Invoice History",
  },
];

const TOUR_STEPS = [
  {
    target: "#tour-dashboard",
    title: "Your Hiring Hub",
    content:
      "Get a bird's-eye view of your recruitment metrics and quick shortcuts.",
    disableBeacon: true,
  },
  {
    target: "#tour-postjob",
    title: "Hire in Minutes",
    content:
      "Upload a JD. Our AI will handle the data entry for you instantly.",
    disableBeacon: true,
  },
  {
    target: "#tour-jobs",
    title: "View Jobs",
    content: "Manage all job postings here.",
    disableBeacon: true,
  },
  {
    target: "#tour-candidates",
    title: "Candidates",
    content: "View all candidates here.",
    disableBeacon: true,
  },
  {
    target: "#tour-team",
    title: "Collaborative Hiring",
    content: "Invite your team members to review candidates.",
    disableBeacon: true,
  },
  {
    target: "#tour-subscription",
    title: "Billing & Subscriptions",
    content:
      "cCoose a plan that fits your growth and manages your billing history in one secure place",
    disableBeacon: true,
  },
  {
    target: "#tour-credits",
    title: "Balance Credits",
    content:
      "Choose a plan that fits your growth and manages your billing history in one secure place",
    disableBeacon: true,
  },
  {
    target: "#tour-add-member",
    title: "Add Team Members",
    content:
      "Bring in more recruiters and managers to speed up your hiring decisions.",
    disableBeacon: true,
  },
  {
    target: "#tour-profile",
    title: "Manage Your Profile",
    content: "Manage your account settings.",
    disableBeacon: true,
  },
];

const JOYRIDE_STYLES = {
  options: {
    zIndex: 99999,
    overlayColor: "rgba(10, 25, 60, 0.75)",
    primaryColor: "#4f8cff",
  },
  spotlight: { backgroundColor: "transparent" },
  tooltip: {
    borderRadius: "16px",
    padding: "0px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    background: "transparent",
  },
  tooltipContent: { padding: "0px" },
  buttonNext: {
    background: "black",
    color: "white",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "14px",
  },
  buttonBack: {
    background: "#cde1ff",
    color: "#333",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "14px",
  },
  buttonSkip: { color: "#333", fontSize: "50px", background: "#0d6af6ff" },
};

const ls = {
  get: (key) => localStorage.getItem(key),
  set: (key, val) => localStorage.setItem(key, val),
};

export function EmployerDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedUser, setLoggedUser] = useState(null);
  const [empPopup, setEmpPopup] = useState(null);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [empInviteForm, setEmpInviteForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  /* Tour auto-starts if first tour never done AND not mobile */
  const [runTour, setRunTour] = useState(false);

  // ── React Query Hooks ──
  const { data: profileData, isLoading: profileLoading } = useEmployerProfile();
  const { data: creditsData, isLoading: creditsLoading } = useEmployerCredits();
  const { data: teamData, isLoading: teamLoading } = useTeamMembers();
  const inviteMutation = useInviteTeamMember();

  const credits = creditsData?.available_credits || 0;
  const teamCount = teamData?.count || 0;

  const isSubPage = SUB_ITEMS.some(({ to }) => location.pathname === to);

  const normalizePath = (path) => {
    if (path === "/employer" || path === "/employer/")
      return "/employer/dashboard";
    return path;
  };

  const [activeMenu, setActiveMenu] = useState(
    isSubPage ? "subscription" : normalizePath(location.pathname),
  );

  /* Sync activeMenu on URL change */
  useEffect(() => {
    const onSubPage = SUB_ITEMS.some(({ to }) => location.pathname === to);
    setActiveMenu(
      onSubPage ? "subscription" : normalizePath(location.pathname),
    );
  }, [location.pathname]);

  /* ── on mount: popup + conditionally start tour ── */
  useEffect(() => {
    const isMobile = window.innerWidth <= 900;
    const firstTourDone = ls.get("letsHyreTourDone") === "true";

    if (!isMobile && !firstTourDone) {
      setTimeout(() => setRunTour(true), 500);
    }
  }, []);

  /* ── show popup conditionally based on team count ── */
  useEffect(() => {
    if (teamData && teamCount === 0 && !ls.get("emp-team-popup-shown")) {
      ls.set("emp-team-popup-shown", "true");
      setEmpPopup("invite");
    }
  }, [teamData, teamCount]);

  /* ── close subscription dropdown on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!document.querySelector(".emp-sidebar")?.contains(e.target)) {
        setSubscriptionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = async () => {
    try {
      setShowLogoutModal(false);
      await logoutMe();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.clear();
      navigate("/", { replace: true });
    }
  };

  const empClosePopup = () => {
    ls.set("emp-team-popup-shown", "true");
    setEmpPopup(null);
  };

  const empHandleInput = (e) =>
    setEmpInviteForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const closeMobile = () => setMobileMenuOpen(false);

  const handleNavClick = (to) => {
    setActiveMenu(to);
    setSubscriptionOpen(false);
    closeMobile();
  };

  const handleSubscriptionClick = () => {
    setActiveMenu("subscription");
    setSubscriptionOpen((prev) => !prev);
  };

  const handleAddMember = async () => {
    setInviteError("");

    if (
      !empInviteForm.name ||
      !empInviteForm.email ||
      !empInviteForm.password
    ) {
      setInviteError("All fields are required");
      return;
    }

    try {
      const payload = {
        full_name: empInviteForm.name,
        email: empInviteForm.email,
        password: empInviteForm.password,
        title: "Recruiter",
      };

      const data = await inviteMutation.mutateAsync(payload);

      if (data.success) {
        setEmpInviteForm({ name: "", email: "", password: "" });
        setInviteSuccess("Member added successfully ✅");

        setTimeout(() => {
          setEmpPopup(null);
          navigate("/employer/your-team");
        }, 3000);
      } else {
        const msg = data?.data
          ? Object.values(data.data).flat().join(", ")
          : data.message;
        setInviteError(msg);
      }
    } catch (err) {
      console.error("ADD MEMBER ERROR:", err);
      setInviteError(
        err?.response?.data?.message || "Failed to add team member",
      );
    }
  };

  const handleJoyrideCallback = (data) => {
    const { status, action, type } = data;

    // Stop tour and permanently mark it as done
    if (
      status === "finished" ||
      status === "skipped" ||
      action === "close" ||
      type === "tour:end"
    ) {
      setRunTour(false);
      ls.set("letsHyreTourDone", "true");
    }
  };

  return (
    <div className="emp-dashboard">
      <Joyride
        steps={TOUR_STEPS}
        run={runTour}
        continuous
        showSkipButton
        scrollToFirstStep
        disableBeacon
        spotlightClicks
        callback={handleJoyrideCallback}
        styles={JOYRIDE_STYLES}
        tooltipComponent={({
          step,
          index,
          backProps,
          primaryProps,
          skipProps,
          isLastStep,
        }) => (
          <div className="tour-card">
            <div className="tour-card-left">
              <div className="tour-step">
                {index + 1}/{TOUR_STEPS.length}
              </div>
              <h4 className="tour-title">{step.title}</h4>
              <p className="tour-desc">{step.content}</p>
              <div className="tour-actions">
                <button {...backProps} className="tour-back">
                  Back
                </button>
                <button
                  {...primaryProps}
                  className="tour-next"
                  onClick={(e) => {
                    if (primaryProps.onClick) primaryProps.onClick(e);
                    if (isLastStep) {
                      handleJoyrideCallback({
                        status: "finished",
                        type: "tour:end",
                      });
                    }
                  }}
                >
                  {isLastStep ? "Finish" : "Next"}
                </button>
              </div>
            </div>
            <div className="tour-card-right">
              <img src={tour} alt="tour" />
            </div>
            <span
              {...skipProps}
              className="tour-skip"
              onClick={(e) => {
                if (skipProps.onClick) skipProps.onClick(e);
                handleJoyrideCallback({
                  status: "skipped",
                  type: "step:after",
                });
              }}
            >
              Skip
            </span>
          </div>
        )}
      />

      {/* ── SIDEBAR ── */}
      <aside className={`emp-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="emp-logo-wrapper">
          <Link to={"/employer/"}>
            <img src={logo} className="emp-logo" alt="logo" />
          </Link>
          <div className="emp-sidebar-close" onClick={closeMobile}>
            ✕
          </div>
        </div>

        <ul className="emp-menu">
          <li className="emp-mobile-only-menu">
            <NavLink
              to="/employer/profile"
              className={
                location.pathname.includes("profile") ? "emp-nav-active" : ""
              }
              onClick={closeMobile}
            >
              <i className="bi bi-person" /> Profile
            </NavLink>
          </li>
          {MENU_ITEMS.map(({ id, to, icon, label }) => (
            <li key={id} id={id}>
              <NavLink
                to={to}
                className={activeMenu === to ? "emp-nav-active" : ""}
                onClick={() => handleNavClick(to)}
              >
                <i className={`bi ${icon}`} /> {label}
              </NavLink>
            </li>
          ))}

          <li id="tour-subscription">
            <button
              className={`emp-sub-toggle
                ${activeMenu === "subscription" && !isSubPage ? "emp-nav-active" : ""}
                ${isSubPage ? "emp-sub-parent-used" : ""}
              `}
              onClick={handleSubscriptionClick}
            >
              <i className="bi bi-currency-dollar" />
              <span>Manage Subscription</span>
            </button>
          </li>

          {subscriptionOpen && (
            <ul className="emp-submenu">
              {SUB_ITEMS.map(({ to, icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={location.pathname === to ? "emp-nav-active" : ""}
                    onClick={closeMobile}
                  >
                    <i className={`bi ${icon}`} /> {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          <li className="emp-logout" onClick={() => setShowLogoutModal(true)}>
            <span className="emp-menu-link">
              <i className="bi bi-box-arrow-right" />
              <span>Logout</span>
            </span>
          </li>
        </ul>
      </aside>

      {mobileMenuOpen && (
        <div className="emp-sidebar-overlay" onClick={closeMobile} />
      )}

      {/* ── MAIN ── */}
      <main className="emp-main">
        <div className="emp-topbar">
          <div className="emp-topbar-box">
            <button className="emp-buttons emp-credits-btn" id="tour-credits">
              {creditsLoading ? (
                <span
                  className="emp-topbar-sk"
                  style={{
                    width: 60,
                    display: "inline-block",
                    height: 16,
                    borderRadius: 4,
                  }}
                ></span>
              ) : (
                <>Credits : {credits}</>
              )}
            </button>
            <button
              className="emp-buttons"
              id="tour-add-member"
              onClick={() => navigate("/employer/your-team")}
            >
              {teamLoading ? (
                <span
                  className="emp-topbar-sk"
                  style={{
                    width: 60,
                    display: "inline-block",
                    height: 16,
                    borderRadius: 4,
                  }}
                ></span>
              ) : (
                <>
                  {teamCount} {teamCount + 1 === 1 ? "Member" : "Members"}
                </>
              )}
            </button>
            <div className="emp-top-icons">
              <i className="bi bi-bell" />
            </div>
            {/* <div className="emp-user-name">
              {profileLoading ? (
                <span
                  className="emp-topbar-sk"
                  style={{
                    width: 80,
                    display: "inline-block",
                    height: 16,
                    borderRadius: 4,
                  }}
                ></span>
              ) : (
                loggedUser?.name || loggedUser?.username || "User"
              )}
            </div> */}
            <div
              className={`emp-top-icons ${
                location.pathname.includes("profile") ? "emp-icon-active" : ""
              }`}
              id="tour-profile"
              onClick={() => navigate("/employer/profile")}
            >
              {profileData?.company_logo ? (
                <img
                  src={profileData.company_logo}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <i className="bi bi-person" />
              )}
            </div>

            <button
              className="emp-hamburger"
              onClick={() => setMobileMenuOpen(true)}
            >
              <i className="bi bi-list" />
            </button>
          </div>
        </div>

        <div className="emp-content">
          <Outlet />
        </div>
      </main>

      {/* ── POPUP: INVITE ── */}
      {empPopup === "invite" && (
        <div className="locked-overlay">
          <div className="locked-card">
            <div className="locked-img">
              <img src={overlay_img} alt="" />
            </div>
            <div className="locked-content">
              <h3>Multiply your Hiring Power</h3>
              <p>Invite your team to hire together</p>
              <div className="emp-popup-actions">
                <button
                  className="emp-btn emp-btn-black"
                  onClick={() => setEmpPopup("form")}
                >
                  Add Team Members
                </button>
                <button
                  className="emp-btn emp-btn-blue"
                  onClick={empClosePopup}
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {empPopup === "form" && (
        <div className="emp-overlay">
          <div className="emp-popup-card emp-form-popup">
            <div className="emp-popup-left">
              <img src={team01} alt="" />
            </div>
            <div className="emp-popup-right">
              <h3>Send Invitation</h3>
              {[
                { name: "name", placeholder: "Full Name", type: "text" },
                { name: "email", placeholder: "Email", type: "email" },
                {
                  name: "password",
                  placeholder: "Set Password",
                  type: "password",
                },
              ].map(({ name, placeholder, type }) => (
                <input
                  key={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={empInviteForm[name]}
                  onChange={empHandleInput}
                />
              ))}

              {inviteError && (
                <p style={{ color: "red", fontSize: "13px" }}>{inviteError}</p>
              )}

              {inviteSuccess && (
                <p style={{ color: "green", fontSize: "13px" }}>
                  {inviteSuccess}
                </p>
              )}

              <button
                className="emp-btn emp-btn-blue"
                onClick={handleAddMember}
                disabled={inviteMutation.isPending || inviteSuccess}
              >
                {inviteMutation.isPending
                  ? "Adding..."
                  : inviteSuccess
                    ? "Redirecting..."
                    : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div
          className="logout-overlay"
          style={{ zIndex: 99999 }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="logout-close"
              onClick={() => setShowLogoutModal(false)}
            >
              <i className="bi bi-x-lg" />
            </div>
            <img src={logout} alt="Hiring" className="logout-img" />
            <h3>Oh no, you're leaving</h3>
            <p className="pp-grey-text">Are you sure you want to logout?</p>
            <div className="logout-actions">
              <button
                className="logout-no"
                onClick={() => setShowLogoutModal(false)}
              >
                Naah! Just Kidding
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
