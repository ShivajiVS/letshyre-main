import { Helmet } from "react-helmet-async";

import candidateImg from "@/assets/get-start01.png";
import employerImg from "@/assets/get-start02.png";

import "./styles/get-started.css";

import { useNavigate } from "react-router";

export function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="lh-direction-page">
      <Helmet>
        <title>Get Started — Hire Talent or Find Jobs | LetsHyre</title>
        <meta
          name="description"
          content="Join LetsHyre as an employer to hire AI-verified notice-period talent, or as a candidate to land your next job with smart AI interviews."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://letshyre.com/get-started" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="LetsHyre" />
        <meta
          property="og:title"
          content="Get Started — Hire Talent or Find Jobs | LetsHyre"
        />
        <meta
          property="og:description"
          content="Choose your path: start hiring AI-verified candidates or find your dream job with LetsHyre."
        />
        <meta property="og:url" content="https://letshyre.com/get-started" />
        <meta property="og:image" content="https://letshyre.com/og-cover.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Get Started — Hire Talent or Find Jobs | LetsHyre"
        />
        <meta
          name="twitter:description"
          content="Choose your path: start hiring AI-verified candidates or find your dream job with LetsHyre."
        />
        <meta
          name="twitter:image"
          content="https://letshyre.com/og-cover.png"
        />
      </Helmet>

      <div className="lh-direction-card">
        <div className="lh-text-part">
          <h1>Looking for your next great hire?</h1>

          <button
            className="button01 get-btn"
            onClick={() => navigate("/employer/sign-in")}
          >
            I'm Hiring →
          </button>
        </div>
        <div className="lh-img-part">
          <img src={employerImg} alt="Employer hiring on LetsHyre" />
        </div>
      </div>

      <div className="lh-Candidat-card">
        <div className="lh-text-part">
          <h1>
            Ready to land your <br /> next job?
          </h1>
          <button
            className="button02 get-btn"
            onClick={() => navigate("/employee/sign-in")}
          >
            I'm Looking for a job →
          </button>
        </div>
        <div className="lh-img-part ">
          <img src={candidateImg} alt="Job seeker finding jobs on LetsHyre" />
        </div>
      </div>
    </div>
  );
}
