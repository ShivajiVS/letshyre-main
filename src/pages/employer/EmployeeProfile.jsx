import { useEffect, useRef, useState } from "react";
import "./EmployeeProfile.css";
import { Link } from "react-router";

const CX = 120,
  CY = 128,
  R = 90,
  STROKE = 28, // Thickness/Height of the progress bars
  GAP_DEG = 8; // The gap size between the two bars

// Helper to convert degrees to X/Y coordinates
function polar(deg) {
  const rad = (deg * Math.PI) / 180;
  return [CX + R * Math.cos(rad), CY - R * Math.sin(rad)];
}

// Helper to draw the SVG Arc path
function arcD(startDeg, endDeg) {
  if (Math.abs(startDeg - endDeg) < 0.5) return "";
  const [x1, y1] = polar(startDeg);
  const [x2, y2] = polar(endDeg);
  const large = startDeg - endDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// The Component drawing the glassmorphic bars
function GaugeSVG({ score }) {
  // Convert 0-100 score to 0-180 degrees
  const scoreDeg = (score / 100) * 180;
  const half = GAP_DEG / 2;

  // Calculate end point for Left (Filled) Bar and start point for Right (Empty) Bar
  const leftEnd = Math.max(180 - scoreDeg + half, 0.5);
  const rightStart = Math.min(180 - scoreDeg - half, 179.5);

  const dLeft = score > 0 ? arcD(180, leftEnd) : "";
  const dRight = score < 100 && rightStart > 1 ? arcD(rightStart, 0) : "";

  return (
    <svg
      viewBox="0 0 240 140"
      className="gauge-svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <defs>
        {/* Neumorphic 3D Glass Effect Filter */}
        <filter id="glassmorphism" x="-30%" y="-30%" width="160%" height="160%">
          {/* Bright white highlight on top/left */}
          <feDropShadow
            dx="-2"
            dy="-2"
            stdDeviation="3"
            floodColor="#ffffff"
            floodOpacity="1"
          />
          {/* Soft dark blue shadow on bottom/right for depth */}
          <feDropShadow
            dx="3"
            dy="3"
            stdDeviation="4"
            floodColor="#90b2e8"
            floodOpacity="0.5"
          />
        </filter>
      </defs>

      {/* Right Segment (Remaining %) — Glassy 3D Effect */}
      {dRight && (
        <path
          d={dRight}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)" // Highly translucent base
          strokeWidth={STROKE}
          strokeLinecap="round"
          filter="url(#glassmorphism)"
        />
      )}

      {/* Left Segment (Achieved %) — Pure Solid White */}
      {dLeft && (
        <path
          d={dLeft}
          fill="none"
          stroke="#ffffff"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function EmployeeProfile() {
  const FINAL_SCORE = 65; // Matches the image percent
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef(null);

  /* Smooth number & arc animation loop */
  useEffect(() => {
    let current = 0;
    const step = () => {
      current = Math.min(current + 1.2, FINAL_SCORE);
      setDisplayScore(Math.round(current));
      if (current < FINAL_SCORE) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="pp-wrapper">
      {/* HERO */}
      <div className="pp-hero">
        <div className="pp-hero-bg-text">LETSHYRE</div>
        <Link to={-1} className="go-back-btn">
          <i className="bi bi-arrow-left"></i>
          <span className="go-back">Go Back</span>
        </Link>
      </div>

      {/* PERSONAL CARD */}
      <div className="pp-personal-card">
        <div className="pp-avatar-block">
          <div className="pp-avatar-wrapper">
            <img
              src="https://wallpapercave.com/wp/wp2362420.jpg"
              className="pp-avatar"
              alt="User Avatar"
            />
            <div className="pp-avatar-overlay"></div>
            <div className="pp-avatar-info">
              <h3 className="pp-avatar-name">Yami Gowtham</h3>
              <p className="pp-avatar-role">UI/UX Designer</p>
            </div>
          </div>
        </div>

        <h4 className="pp-heading" style={{ marginTop: "10px" }}>
          Personal Details
        </h4>

        <div className="personal-details-container">
          <div className="details-grid">
            {/* First Col */}
            <div className="grid-column">
              <div className="pp-item">
                <i className="bi bi-envelope"></i>
                <p
                  className="pp-grey-text"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  yamigowtham123@gmail.com
                </p>
              </div>
              <div className="pp-item">
                <i className="bi bi-telephone"></i>
                <p className="pp-grey-text">+91 8919323499</p>
              </div>
              <div className="pp-item">
                <i className="bi bi-geo-alt"></i>
                <p className="pp-grey-text">Bangalore, Karnataka</p>
              </div>
            </div>

            {/* Second Col */}
            <div className="grid-column center-column">
              <div className="pp-item">
                <i className="bi bi-flag"></i>
                <p className="pp-grey-text">India</p>
              </div>
              <div className="pp-item">
                <i className="bi bi-person"></i>
                <p className="pp-grey-text">Female</p>
              </div>
            </div>

            {/* Third Col */}
            <div className="grid-column right-column">
              <div className="pp-item">
                <i className="bi bi-patch-check"></i>
                <p className="pp-grey-text">Profile Verified</p>
              </div>
              <div className="pp-item">
                <i className="bi bi-award"></i>
                <div className="score-container">
                  <p className="pp-grey-text">Last Interview Score</p>
                  <div className="progress-wrapper">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <span className="progress-badge">65%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="pp-main-grid">
        {/* LEFT */}
        <div className="pp-left">
          <div className="pp-card">
            <h4 className="pp-heading Experence-text">Work Experience</h4>
            <div className="pp-timeline">
              <div className="pp-time-item">
                <h5>UI/UX Designer</h5>
                <p className="pp-grey-text">Google LLC - Bengaluru, India</p>
                <p className="pp-grey-text">2 Years</p>
              </div>
              <div className="pp-time-item">
                <h5>Product Designer</h5>
                <p className="pp-grey-text">TCS - Hyderabad</p>
                <p className="pp-grey-text">3 Years</p>
              </div>

              <div className="pp-time-item">
                <h5>Backend Engineer</h5>
                <p className="pp-grey-text">Microsoft - Hyderabad</p>
                <p className="pp-grey-text">4 Years</p>
              </div>

              <div className="pp-time-item">
                <h5>Backend Engineer</h5>
                <p className="pp-grey-text"> Apple - Hyderabad</p>
                <p className="pp-grey-text">2.5 Years</p>
              </div>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Projects</h4>
            <div className="pp-edu">
              <h5>Project 1 Title</h5>
              <p className="pp-grey-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem,
                ipsum dolor sit amet consectetur adipisicing elit. Explicabo
                pariatur quam mollitia. Beatae, quaerat tempora. Quaerat
                delectus ex sequi repellendus voluptatibus autem enim quod
                facere, nesciunt, dignissimos, minus voluptatum eligendi.
              </p>
            </div>
            <div className="pp-edu">
              <h5>Project 1 Title</h5>
              <p className="pp-grey-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem,
                ipsum dolor sit amet consectetur adipisicing elit. Explicabo
                pariatur quam mollitia. Beatae, quaerat tempora. Quaerat
                delectus ex sequi repellendus voluptatibus autem enim quod
                facere, nesciunt, dignissimos, minus voluptatum eligendi.
              </p>
            </div>
            <div className="pp-edu">
              <h5>Project 1 Title</h5>
              <p className="pp-grey-text">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo pariatur quam mollitia. Beatae, quaerat tempora.
                Quaerat delectus ex sequi repellendus voluptatibus autem enim
                quod facere, nesciunt, dignissimos, minus voluptatum eligendi.
              </p>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Education</h4>
            <div className="pp-edu">
              <h5>Rajiv Gandhi University - RK Valley</h5>
              <p className="pp-grey-text">Pre University Course</p>
              <p className="pp-grey-text">CGPA : 9.7</p>
            </div>
            <div className="pp-edu">
              <h5>Diploma prasiddha college of engineering - Amalapuram</h5>
              <p className="pp-grey-text">Pre University Course</p>
              <p className="pp-grey-text">CGPA : 8.0</p>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Accomplishment</h4>
            <div className="pp-edu">
              <p className="pp-grey-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem
                ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor
                sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet
                consectetur adipisicing elit.Lorem ipsum dolor sit amet
                consectetur adipisicing elit.
              </p>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Preferences</h4>
            <div className="pp-edu">
              <h5>Job Preferences</h5>
              <p className="pp-grey-text">Backend Developer, AI ML Engineer</p>
              <h5>Preferred location</h5>
              <p className="pp-grey-text">Hyderabad , Chennai</p>
              <h5>Preferred Industry</h5>
              <p className="pp-grey-text">IT Industry</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="pp-right">
          {/* ── FRONTEND SCORE CARD ── */}
          <div className="pp-card pp-score-card">
            <h4
              className="pp-heading"
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              Frontend Interview Score
            </h4>

            <div className="score-card-wrap">
              <div className="score-card-shadow"></div>

              <div className="score-card-body">
                {/* Dynamically Split Arc Gauge */}
                <div className="gauge-area">
                  <GaugeSVG score={displayScore} />

                  {/* Percentage + Subtitle Overlay */}
                  <div className="gauge-text-block">
                    <div className="gauge-pct">{displayScore}%</div>
                    <div className="gauge-sub">
                      Based on 10 Interview
                      <br />
                      Questions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard flow button */}
            <div className="gauge-details-btn-container">
              <Link
                to="/employer/employee-score-card"
                className="gauge-details-btn"
              >
                Check Full Details
              </Link>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Roles Applied</h4>
            <div className="pp-role">UI/UX Designer</div>
            <div className="pp-role">Product Designer</div>
            <div className="pp-role">UX Designer</div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Skills</h4>
            <div className="pp-skills">
              <span>Wireframing</span>
              <span>Color Theory</span>
              <span>Responsive Design</span>
              <span>User Research</span>
              <span>Typography</span>
              <span>Design Systems</span>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">CTC & Salary Expectations</h4>
            <div className="pp-edu">
              <h5>Current CTC</h5>
              <p className="pp-grey-text">₹ 5,00,000</p>
              <h5>Expected CTC</h5>
              <p className="pp-grey-text">₹ 8,00,000</p>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Resume</h4>
            <div className="pp-edu">
              <button className="pp-download-btn">View Resume</button>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Notice Period</h4>
            <div className="pp-edu">
              <h5>Notice Period</h5>
              <p className="pp-grey-text">2 Months</p>
              <h5>Notice Period Proof</h5>
              <button className="pp-download-btn">View Proof</button>
            </div>
          </div>

          <div className="pp-card">
            <h4 className="pp-heading">Address</h4>
            <div className="pp-edu">
              <h5>Address 1</h5>
              <p className="pp-grey-text">
                Flat No. 302, Sai Residency Madhapur Main Road Hyderabad,
                Telangana 500081 India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
