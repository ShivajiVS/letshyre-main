import { useState, useEffect, useCallback, useRef } from "react";
import { Joyride, STATUS, EVENTS, ACTIONS, LIFECYCLE } from "react-joyride";
import { useNavigate, NavLink, Link, Outlet, useLocation } from "react-router";

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
    skipBeacon: true,
  },
  {
    target: "#tour-postjob",
    title: "Hire in Minutes",
    content:
      "Upload a JD. Our AI will handle the data entry for you instantly.",
    skipBeacon: true,
  },
  {
    target: "#tour-jobs",
    title: "View Jobs",
    content: "Manage all job postings here.",
    skipBeacon: true,
  },
  {
    target: "#tour-candidates",
    title: "Candidates",
    content: "View all candidates here.",
    skipBeacon: true,
  },
  {
    target: "#tour-team",
    title: "Collaborative Hiring",
    content: "Invite your team members to review candidates.",
    skipBeacon: true,
  },
  {
    target: "#tour-subscription",
    title: "Billing & Subscriptions",
    content:
      "Choose a plan that fits your growth and manage your billing history in one secure place.",
    skipBeacon: true,
  },
  {
    target: "#tour-credits",
    title: "Balance Credits",
    content:
      "Track your remaining credits here and top up anytime to keep unlocking candidates.",
    skipBeacon: true,
  },
  {
    target: "#tour-add-member",
    title: "Add Team Members",
    content:
      "Bring in more recruiters and managers to speed up your hiring decisions.",
    skipBeacon: true,
  },
  {
    target: "#tour-profile",
    title: "Manage Your Profile",
    content: "Manage your account settings.",
    skipBeacon: true,
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

/* Tour is desktop-only. Must match the `.tour-card` hide breakpoint
   (@media max-width: 992px) in employer-dashboard-layout.css so the tour
   never runs while its card is hidden by CSS — the old 900-vs-992 mismatch
   left a dead-zone (901–992px) where the overlay showed but the card did not. */
const TOUR_HIDE_MAX_WIDTH = 992;

/* Versioned so adding/changing steps re-shows the tour once for returning
   users. Bump the suffix whenever TOUR_STEPS changes meaningfully. */
const TOUR_STORAGE_KEY = "letsHyreTour:v2";

/* Matches Joyride's `spotlightPadding` so our glow ring lines up with the
   library's cutout hole. */
const TOUR_SPOTLIGHT_PAD = 10;

/* Stable, module-level tooltip so Joyride doesn't remount it every render.
   Uses Joyride's `size` (total steps) so it stays correct even when the
   step list is filtered to the targets actually present in the DOM. */
function TourTooltip({
  step,
  index,
  size,
  backProps,
  primaryProps,
  skipProps,
  isLastStep,
}) {
  return (
    <div className="tour-card">
      <div className="tour-card-left">
        <div className="tour-step">
          {index + 1}/{size}
        </div>
        <h4 className="tour-title">{step.title}</h4>
        <p className="tour-desc">{step.content}</p>
        <div className="tour-actions">
          {index > 0 && (
            <button {...backProps} className="tour-back">
              Back
            </button>
          )}
          <button {...primaryProps} className="tour-next">
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
      <div className="tour-card-right">
        <img src={tour} alt="tour" />
      </div>
      <button {...skipProps} className="tour-skip">
        Skip
      </button>
    </div>
  );
}

/* Owns all product-tour state: auto-start gating, persistence, target
   filtering and the Joyride callback. `ready` should be true once the data
   driving the step targets has loaded. */
function useTour({ ready }) {
  const [runTour, setRunTour] = useState(false);
  const [steps, setSteps] = useState(TOUR_STEPS);
  /* Bounding rect of the current step's target, used to draw our own glow
     ring. v3 renders its spotlight as a full-viewport <svg> mask, so a
     box-shadow on .react-joyride__spotlight can't ring the element — and a
     ring on the element itself would be clipped by .emp-sidebar/.emp-main
     overflow. A position:fixed ring tracking this rect avoids both. */
  const [highlight, setHighlight] = useState(null);
  const activeTargetRef = useRef(null);

  const moveHighlightTo = useCallback((selector) => {
    activeTargetRef.current = selector;
    const el = selector ? document.querySelector(selector) : null;
    if (!el) {
      setHighlight(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setHighlight({
      top: r.top - TOUR_SPOTLIGHT_PAD,
      left: r.left - TOUR_SPOTLIGHT_PAD,
      width: r.width + TOUR_SPOTLIGHT_PAD * 2,
      height: r.height + TOUR_SPOTLIGHT_PAD * 2,
    });
  }, []);

  const endTour = useCallback(() => {
    activeTargetRef.current = null;
    setHighlight(null);
    setRunTour(false);
    ls.set(TOUR_STORAGE_KEY, "true");
  }, []);

  /* Filter to steps whose target is actually in the DOM so a missing/hidden
     element can never leave the overlay stuck on a blank spotlight. */
  const startTour = useCallback(() => {
    const available = TOUR_STEPS.filter((s) =>
      document.querySelector(s.target),
    );
    if (available.length === 0) return;
    setSteps(available);
    setRunTour(true);
  }, []);

  /* Auto-start once: desktop only, not previously seen, data settled.
     Persist "seen" the moment it auto-opens (not only on finish) so a refresh
     mid-tour doesn't replay it. The `?` button still replays on demand. */
  useEffect(() => {
    const isMobile = window.innerWidth <= TOUR_HIDE_MAX_WIDTH;
    const seen = ls.get(TOUR_STORAGE_KEY) === "true";

    if (isMobile || seen || !ready) return;

    const timer = setTimeout(() => {
      ls.set(TOUR_STORAGE_KEY, "true");
      startTour();
    }, 300);
    return () => clearTimeout(timer);
  }, [ready, startTour]);

  /* Keep the ring aligned with its target if the viewport reflows mid-step. */
  useEffect(() => {
    if (!runTour) return;
    const onReflow = () => moveHighlightTo(activeTargetRef.current);
    window.addEventListener("resize", onReflow);
    return () => window.removeEventListener("resize", onReflow);
  }, [runTour, moveHighlightTo]);

  const handleCallback = useCallback(
    ({ status, action, type, lifecycle, step }) => {
      if (lifecycle === LIFECYCLE.TOOLTIP && step?.target) {
        moveHighlightTo(step.target);
      }

      const finished =
        status === STATUS.FINISHED || status === STATUS.SKIPPED;
      const closed = action === ACTIONS.CLOSE;
      const targetMissing = type === EVENTS.TARGET_NOT_FOUND;

      if (finished || closed || targetMissing) endTour();
    },
    [moveHighlightTo, endTour],
  );

  return { runTour, steps, highlight, startTour, handleCallback };
}

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

  // ── React Query Hooks ──
  const { data: profileData, isLoading: profileLoading } = useEmployerProfile();
  const { data: creditsData, isLoading: creditsLoading } = useEmployerCredits();
  const { data: teamData, isLoading: teamLoading } = useTeamMembers();
  const inviteMutation = useInviteTeamMember();

  const credits = creditsData?.available_credits || 0;
  const teamCount = teamData?.count || 0;

  /* Product tour — auto-starts once data has settled so every step target
     (#tour-credits, #tour-add-member, …) is in the DOM before Joyride looks
     for it. `startTour` is also exposed for the manual replay trigger. */
  const {
    runTour,
    steps: tourSteps,
    highlight: tourHighlight,
    startTour,
    handleCallback,
  } = useTour({
    ready: !profileLoading && !creditsLoading && !teamLoading,
  });

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

  return (
    <div className="emp-dashboard">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        scrollToFirstStep
        callback={handleCallback}
        styles={JOYRIDE_STYLES}
        tooltipComponent={TourTooltip}
      />

      {/* Glow ring around the active step's target — v3's own spotlight is an
          SVG mask that can't carry our box-shadow, so we draw it ourselves. */}
      {runTour && tourHighlight && (
        <div
          className="tour-spotlight-ring"
          style={{
            top: tourHighlight.top,
            left: tourHighlight.left,
            width: tourHighlight.width,
            height: tourHighlight.height,
          }}
        />
      )}

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
            <div
              className="emp-top-icons"
              role="button"
              tabIndex={0}
              title="Replay product tour"
              onClick={startTour}
            >
              <i className="bi bi-question-circle" />
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
