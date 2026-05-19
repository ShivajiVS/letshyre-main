import { useNavigate } from "react-router";

import heroImg from "@/assets/hero1.jpeg";
import first_part_bg from "@/assets/FP_bg.png";
import Tagline from "./Tagline";

import "./hero2.css";

const Hero2 = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-container" id="home">
      <div className="hero-top-row">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-highlight">New</span> Smart Interviewing Tech
          </div>

          <h1 className="hero-title">
            AI Hiring Platform for <br />
            <span className="text-gradient">Notice-Period Talent</span>
          </h1>

          <p className="hero-description">
            Letshyre automates resume evaluation, AI interviews, and candidate
            verification for modern HR teams. Build your dream team faster,
            without the screening overhead.
          </p>

          <div className="hero-actions">
            <button className="btn-primary">I'm Hiring &rarr;</button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/get-started")}
            >
              I'm looking for a job
            </button>
          </div>

          <div className="percetage-box">
            <div className="percetage-box-inner01">
              <span>100%</span>
              <p>AI-Verified</p>
            </div>
            <div className="percetage-box-inner02">
              <p className="grey-text">Increase your Hiring by</p>
              <span>40%</span>
              <a href="#categories">See the categories→</a>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-wrapper">
            <img
              src={heroImg}
              alt="Letshyre Platform"
              className="hero-main-img"
            />
            <div className="visual-glow"></div>
          </div>
        </div>
      </div>
      <Tagline />

      {/* Re-using your background shape as a modern ambient gradient blur */}
      <img
        className="hero-bg-shape"
        src={first_part_bg}
        alt=""
        aria-hidden="true"
      />
    </section>
  );
};

export default Hero2;
