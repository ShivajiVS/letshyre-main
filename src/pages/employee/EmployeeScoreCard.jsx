import { useSearchParams } from "react-router";
import { useScorecardDetail } from "@/hooks/employee/useScorecardDetail";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";

import sc_bg from "@/assets/scorecard-bg.png";

import "./styles/employee-scorecard.css";

export function EmployeeScoreCard() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const { data, isLoading, isError } = useScorecardDetail(id);
  const scorecard = data?.data;

  const { data: userData, isLoading: isProfileLoading } = useCandidateProfile();

  if (isLoading) {
    return <ScorecardSkeleton />;
  }

  if (isError || !data?.success || !scorecard) {
    return (
      <div className="esc-empty">
        <div className="esc-empty-card">
          <h2>No Scorecards Found</h2>
          <p>
            It looks like you haven't completed any interviews that generated a
            scorecard yet.
          </p>
        </div>
      </div>
    );
  }

  const {
    candidate_name,
    candidate_role,
    overall_score,
    created_at,
    candidate_skills,
    category_scores,
  } = scorecard;

  const commMetrics = category_scores?.comm_metrics || {};
  const questionBreakdown = category_scores?.question_breakdown || [];
  const strengths = category_scores?.strengths || [];
  const recommendations = category_scores?.recommendations || [];
  const areasForImprovement = category_scores?.areas_for_improvement || [];

  const metricsArray = [
    { label: "Clarity", value: commMetrics.clarity || 0 },
    { label: "Relevance", value: commMetrics.relevance || 0 },
    { label: "Confidence", value: commMetrics.confidence || 0 },
    { label: "Depth of Thought", value: commMetrics.depth_of_thought || 0 },
    {
      label: "Key Concept Coverage",
      value: commMetrics.key_concept_coverage || 0,
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="sc-section-main">
      <h3>Here's The Candiate's Scorecard</h3>
      <p className="pp-grey-text">
        Your AI-generated scorecard highlights what went great and where you can
        grow for future interviews
      </p>

      {/* ================= CANDIDATE DETAILS ================= */}
      <div className="sc-cand-details-box">
        <div className="sc-cand-details">
          <div className="sc-cand-col">
            <h4>Candidate Name</h4>
            <h3>{candidate_name || "N/A"}</h3>
          </div>
          <div className="sc-cand-divider" />
          <div className="sc-cand-col">
            <h4>Role Applied For</h4>
            <h3>{candidate_role || "N/A"}</h3>
          </div>
          <div className="sc-cand-divider" />
          <div className="sc-cand-col sc-cand-col--right">
            <h4>Interview Date</h4>
            <h3>{formatDate(created_at)}</h3>
          </div>
        </div>
      </div>

      <div className="sc-wrapper">
        {/* ================= TOP GRID ================= */}
        <div className="sc-top-grid">
          <div className="sc-left-part-main">
            <div className="sc-left-part">
              {/* PROFILE CARD */}
              <div className="sc-profile-card">
                <img src={userData?.profile_photo} alt="candidate" />
                <div className="sc-profile-overlay">
                  <h3>{candidate_name || "N/A"}</h3>
                  <p>{candidate_role || "N/A"}</p>
                </div>
              </div>
              {/* PERFORMANCE CARD */}
              <div className="sc-performance-card">
                <h1>
                  {overall_score != null ? overall_score.toFixed(1) : "0"}%
                </h1>
                <h3>Overall Performance Summary</h3>
                <p>Based on {questionBreakdown.length} Interview Questions</p>
                <div className="sc-circle-bg">
                  <img src={sc_bg} alt="" />
                </div>
              </div>
            </div>

            {/* ================= METRICS CHART ================= */}
            <div className="sc-metrics-card">
              <h3>Communication Metrics (0-100)</h3>
              <div className="sc-bar-chart">
                {metricsArray.map((item, i) => (
                  <div key={i} className="sc-bar-item">
                    <div className="sc-bar-value">
                      {Math.round(item.value)}%
                    </div>
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
                {metricsArray.map((item, i) => (
                  <span key={i}>{item.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SKILLS */}
          {candidate_skills && candidate_skills.length > 0 && (
            <div className="sc-skills-card">
              <h3>Candidate Skills Evaluated</h3>
              <div className="sc-skills-list">
                {candidate_skills.map((skill, i) => (
                  <div key={i} className="sc-skill">
                    <span>{"</>"}</span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* ================= QUESTIONS & ANSWERS (NEW DESIGN) ================= */}
        {questionBreakdown.length > 0 && (
          <div className="esc-qa-section">
            <h3 className="esc-qa-heading">Questions & Answers Breakdown</h3>

            {questionBreakdown.map((qa, i) => {
              const badgeType = qa.type ? qa.type.toLowerCase() : "default";
              return (
                <div key={i} className="esc-qa-card">
                  <div className="esc-qa-header">
                    <span className={`esc-qa-badge ${badgeType}`}>
                      {qa.type || "Q"}
                    </span>
                    {/* 
                    <span className="esc-qa-score">
                      Score: {qa.earned_points || 0} / {qa.max_points || 0}
                    </span>
                    */}
                  </div>

                  <div className="esc-qa-question">
                    <div className="esc-qa-number">{i + 1}</div>
                    <p>{qa.question_text || "No question text provided."}</p>
                  </div>

                  <div className="esc-qa-answer-box">
                    <h5>Provided Answer</h5>
                    {qa.type === "CODING" ? (
                      <code>{qa.answer_provided || "No code provided."}</code>
                    ) : qa.type === "AUDIO" ? (
                      <p>{qa.transcript || "No transcript available."}</p>
                    ) : (
                      <p>{qa.answer_provided || "No answer provided."}</p>
                    )}
                  </div>

                  {/* qa.feedback && (
                    <div className="esc-qa-feedback">
                      <h5>AI Feedback</h5>
                      <p>{qa.feedback}</p>
                    </div>
                  ) */}
                </div>
              );
            })}
          </div>
        )}

        {/* ================= FEEDBACK SECTIONS ================= */}
        {(strengths.length > 0 || recommendations.length > 0 || areasForImprovement.length > 0) && (
          <div className="esc-feedback-section">
            {strengths.length > 0 && (
              <div className="esc-feedback-card">
                <h3>Key Strengths</h3>
                <ul className="esc-feedback-list">
                  {strengths.map((item, idx) => (
                    <li key={idx} className="esc-feedback-item">
                      <div className="esc-feedback-icon esc-feedback-icon--strength">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {areasForImprovement.length > 0 && (
              <div className="esc-feedback-card">
                <h3>Areas for Improvement</h3>
                <ul className="esc-feedback-list">
                  {areasForImprovement.map((item, idx) => (
                    <li key={idx} className="esc-feedback-item">
                      <div className="esc-feedback-icon esc-feedback-icon--improvement">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      </div>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="esc-feedback-card">
                <h3>Recommendations</h3>
                <ul className="esc-feedback-list">
                  {recommendations.map((item, idx) => (
                    <li key={idx} className="esc-feedback-item">
                      <div className="esc-feedback-icon esc-feedback-icon--recommendation">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </div>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScorecardSkeleton() {
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          height: 100,
          marginBottom: 24,
          borderRadius: 24,
          background: "#fff",
          padding: 30,
        }}
      >
        <div
          className="esc-sk"
          style={{ height: 30, width: 250, marginBottom: 12 }}
        ></div>
        <div className="esc-sk" style={{ height: 16, width: 400 }}></div>
      </div>

      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <div
            className="esc-sk"
            style={{ height: 180, marginBottom: 24, borderRadius: 24 }}
          ></div>
          <div
            className="esc-sk"
            style={{ height: 200, borderRadius: 24 }}
          ></div>
        </div>
        <div
          className="esc-sk"
          style={{ flex: 1, height: 404, borderRadius: 24 }}
        ></div>
      </div>

      <div
        className="esc-sk"
        style={{ height: 150, borderRadius: 24, marginBottom: 24 }}
      ></div>
      <div className="esc-sk" style={{ height: 400, borderRadius: 24 }}></div>

      <style>{`
        @keyframes escShimmer {
          0% { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        .esc-sk {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 800px 100%;
          animation: escShimmer 1.5s infinite linear;
          border-radius: 16px;
        }
      `}</style>
    </div>
  );
}
