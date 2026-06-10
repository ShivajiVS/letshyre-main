import React, { useEffect, useRef } from "react";
import bg_logo from "@/assets/bg-logo.png";
import { useNavigate } from "react-router";

import "./styles/footer.css";

export function Footer() {
  const footerRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ft-visible");
          obs.unobserve(entry.target); // run once
        }
      },
      { threshold: 0.25 },
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="ft-footer" ref={footerRef}>
      <div className="ft-top">
        {/* Brand */}
        <div className="ft-column ft-brand">
          <h3 className="ft-logo">LetsHyre</h3>
          <p className="ft-desc">
            The AI platform revolutionizing how talent and opportunities
            connect.
          </p>

          <div className="ft-socials">
            <a href="https://wa.me/919346708639" target="_blank" rel="noopener noreferrer" className="ft-social-icon">
              <i className="bi bi-whatsapp"></i>
            </a>
            <a href="https://x.com/letshyreAi" target="_blank" rel="noopener noreferrer" className="ft-social-icon">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="https://www.linkedin.com/company/letshyre/" target="_blank" rel="noopener noreferrer" className="ft-social-icon">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61585708555581" target="_blank" rel="noopener noreferrer" className="ft-social-icon">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/letshyreofficial/" target="_blank" rel="noopener noreferrer" className="ft-social-icon">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://www.youtube.com/@LetsHyre" target="_blank" rel="noopener noreferrer" className="ft-social-icon">
              <i className="bi bi-youtube"></i>
            </a>
          </div>
        </div>

        {/* Product */}
        <div className="ft-column">
          <h4 className="ft-title">Product</h4>
          <ul className="ft-links">
            <li>Features</li>
            <li>Pricing</li>
            <li>AI Interview Demo</li>
            <li>Integrations</li>
          </ul>
        </div>

        {/* Company */}
        <div className="ft-column">
          <h4 className="ft-title">Company</h4>
          <ul className="ft-links">
            <li>About Us</li>
            <li>Careers</li>
            <li
              onClick={() => {
                navigate("/T&C");
              }}
            >
              Terms & Conditions
            </li>
            <li
              onClick={() => {
                navigate("/Policy");
              }}
            >
              Privacy Policy
            </li>
            <li
              onClick={() => {
                navigate("/refund-policy");
              }}
            >
              Refund Policy
            </li>
            {/* <li>Blog</li> */}
            <li
              onClick={() => {
                navigate("/contact");
              }}
            >
              Contact
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="ft-column ft-newsletter">
          <h4 className="ft-title">Stay Updated</h4>
          <p className="ft-desc">
            Get the latest news and updates from LetsHyre
          </p>

          <form className="ft-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Email" className="ft-input" />
            <button type="submit" className="ft-submit">
              ✉
            </button>
          </form>
        </div>
      </div>

      {/* Big background text (NO animation logic here) */}
      <div className="ft-bottom-text">
        <img src={bg_logo} className="ft-logo" alt="" />
        {/* <h1 className="ft-final-text">LETSHYRE</h1> */}
      </div>
    </footer>
  );
}
