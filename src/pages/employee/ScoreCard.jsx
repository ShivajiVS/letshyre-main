import sc_bg from "@/assets/scorecard-bg.png";
import user_pic from "@/assets/user-pic.jpeg";

import "./ScoreCard.css";

export function ScoreCard() {
  const metrics = [
    { label: "Clarity", value: 100 },
    { label: "Relevance", value: 80 },
    { label: "Confidence", value: 65 },
    { label: "Depth of Thought", value: 50 },
    { label: "Communication Quality", value: 40 },
  ];

  const skills = [
    "Python",
    "Django",
    "Rest APIs",
    "SQL",
    "React.js",
    "Python",
    "Django",
    "Rest APIs",
  ];

  return (
    <div className="sc-section-main">
      <h3>Here’s How You Did!</h3>
      <p className="pp-grey-text">
        Your AI-generated scorecard highlights what went great and where you can
        grow for future interviews
      </p>
      <div className="sc-cand-details-box">
        <div className="sc-cand-details">
          <div className="sc-cand-left">
            <h4>Candidate Name</h4>
            <h3>G Pratyusha</h3>
          </div>
          <div className="sc-cand-right">
            <h4>Interview Date</h4>
            <h3>Jan 02, 2026</h3>
          </div>
        </div>

        <h4>Roles applied for </h4>
        <div className="sc-role-tags">
          <span className="sc-role-tag">Senior Full Stack Developer</span>
          <span className="sc-role-tag">Frontend Developer</span>
          <span className="sc-role-tag">Backend Developer</span>
        </div>
      </div>

      <div className="sc-wrapper">
        {/* ================= TOP GRID ================= */}
        <div className="sc-top-grid">
          <div className="sc-left-part-main">
            <div className="sc-left-part">
              {/* PROFILE CARD */}
              <div className="sc-profile-card">
                {/* <img src="https://i.pravatar.cc/300" alt="candidate" /> */}
                <img src={user_pic} alt="candidate" />
                <div className="sc-profile-overlay">
                  <h3>G Pratyusha</h3>
                  <p>UI/UX Designer</p>
                </div>
              </div>
              {/* PERFORMANCE CARD */}
              <div className="sc-performance-card">
                <h1>87%</h1>
                <h3>Overall Performance Summary</h3>
                <p>Based on the Interview </p>
                <div className="sc-circle-bg">
                  <img src={sc_bg} alt="" />
                </div>
              </div>
            </div>
            {/* ================= METRICS CHART ================= */}
            <div className="sc-metrics-card">
              <h3>Audio Communication Metrics (0-100)</h3>

              <div className="sc-bar-chart">
                {metrics.map((item, i) => (
                  <div key={i} className="sc-bar-item">
                    {/* Percentage Above */}
                    <div className="sc-bar-value">{item.value}%</div>

                    {/* Bar */}
                    <div className="sc-bar-container">
                      <div
                        className="sc-bar"
                        style={{ height: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="sc-bar-label">
                <span>Clarity</span>
                <span>Relevance</span>
                <span>Confidence</span>
                <span>Depth of Thought</span>
                <span>Communication Quality</span>
              </div>
            </div>
          </div>

          {/* SKILLS */}
          <div className="sc-skills-card">
            <h3>Candidate Skills</h3>

            <div className="sc-skills-list">
              {skills.map((skill, i) => (
                <div key={i} className="sc-skill">
                  <span>{"</>"}</span>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
