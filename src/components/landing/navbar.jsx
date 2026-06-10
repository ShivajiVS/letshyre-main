import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import logo from "@/assets/logo2.png";

import "./styles/navbar.css";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setOpen(false);
  };

  // ✅ FIX: hash-based active logic
  const getNavClass = (pathOrHash) => {
    if (pathOrHash.startsWith("/")) {
      return `ls-nav-link ${location.pathname === pathOrHash ? "ls-nav-link-active" : ""}`;
    }
    const currentHash = location.hash || "#home";
    return `ls-nav-link ${currentHash === pathOrHash && location.pathname === "/" ? "ls-nav-link-active" : ""}`;
  };

  const getMobileClass = (pathOrHash) => {
    if (pathOrHash.startsWith("/")) {
      return `ls-mobile-link ${location.pathname === pathOrHash ? "ls-mobile-link-active" : ""}`;
    }
    const currentHash = location.hash || "#home";
    return `ls-mobile-link ${
      currentHash === pathOrHash && location.pathname === "/" ? "ls-mobile-link-active" : ""
    }`;
  };

  return (
    <header className={`ls-navbar hide-on-print ${isScrolled ? "ls-navbar-scrolled" : ""}`}>
      <div className="ls-navbar-inner">
        <div className="ls-logo-area">
          <NavLink to="/#home" className="ls-logo-text">
            <img src={logo} alt="Letshyre logo" />
          </NavLink>
        </div>

        {/* Desktop Links */}
        <nav className="ls-nav-links">
          <NavLink to="/#home" className={() => getNavClass("#home")}>
            Home
          </NavLink>
          <NavLink
            to="/#how-it-works"
            className={() => getNavClass("#how-it-works")}
          >
            How It Works
          </NavLink>
          <NavLink
            to="/#ai-interview"
            className={() => getNavClass("#ai-interview")}
          >
            AI Interview
          </NavLink>
          <NavLink
            to="/#scorecards"
            className={() => getNavClass("#scorecards")}
          >
            Scorecards
          </NavLink>
          <NavLink to="/contact" className={() => getNavClass("/contact")}>
            Contact
          </NavLink>
        </nav>

        <NavLink to="/get-started" className="ls-demo-btn">
          Get Started
        </NavLink>

        {/* Mobile Hamburger (Updated SVG) */}
        <button
          className={`ls-burger ${open ? "ls-burger-open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <svg
            width="32" /* Slightly larger for better tap targeting */
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Line */}
            <path
              className="line-top"
              d="M9 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Middle Line */}
            <path
              className="line-mid"
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom Line */}
            <path
              className="line-bot"
              d="M12 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/*  Dark Overlay Backdrop */}
      <div
        className={`ls-mobile-overlay ${open ? "ls-mobile-overlay-open" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Dropdown */}
      <div className={`ls-mobile-menu ${open ? "ls-mobile-menu-open" : ""}`}>
        <NavLink
          to="/#home"
          className={() => getMobileClass("#home")}
          onClick={handleNavClick}
        >
          Home
        </NavLink>
        <NavLink
          to="/#how-it-works"
          className={() => getMobileClass("#how-it-works")}
          onClick={handleNavClick}
        >
          How It Works
        </NavLink>
        <NavLink
          to="/#ai-interview"
          className={() => getMobileClass("#ai-interview")}
          onClick={handleNavClick}
        >
          AI Interview
        </NavLink>
        <NavLink
          to="/#scorecards"
          className={() => getMobileClass("#scorecards")}
          onClick={handleNavClick}
        >
          Scorecards
        </NavLink>
        <NavLink
          to="/contact"
          className={() => getMobileClass("/contact")}
          onClick={handleNavClick}
        >
          Contact
        </NavLink>

        <NavLink
          to="/get-started"
          className="ls-mobile-demo-btn"
          onClick={handleNavClick}
        >
          Get Started
        </NavLink>

        <div className="ls-mobile-footer">
          Letshyre © {new Date().getFullYear()}
        </div>
      </div>
    </header>
  );
}
