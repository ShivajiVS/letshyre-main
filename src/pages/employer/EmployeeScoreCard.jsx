import { useSearchParams } from "react-router";

import sc_bg from "@/assets/scorecard-bg.png";
import { useUnlockedCandidateScorecard } from "@/hooks/employer/useUnlockedCandidateScorecard";
import "./styles/EmployeeScoreCard.css";

export function EmployeeScoreCard() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: responseData,
    isLoading,
    isError,
  } = useUnlockedCandidateScorecard(id);

  if (!id) {
    return (
      <div className="sc-section-main">
        <div className="sc-error-banner">No Candidate found</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="sc-section-main">
        <h3 className="skeleton-text skeleton-heading"></h3>
        <p className="skeleton-text skeleton-subheading"></p>
        <div
          className="sc-cand-details-box skeleton-box"
          style={{ height: "100px" }}
        ></div>
        <div className="sc-wrapper">
          <div className="sc-top-grid">
            <div className="sc-left-part-main">
              <div className="sc-left-part">
                <div
                  className="sc-profile-card skeleton-box"
                  style={{ height: "300px" }}
                ></div>
              </div>
            </div>
            <div
              className="sc-skills-card skeleton-box"
              style={{ height: "300px" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !responseData?.data) {
    return (
      <div className="sc-section-main">
        <div className="sc-error-banner">
          Failed to load the scorecard. It may not be generated yet or the ID is
          invalid.
        </div>
      </div>
    );
  }

  const scData = responseData.data;
  const {
    candidate_name,
    candidate_role,
    overall_score,
    created_at,
    candidate_skills,
    candidate_profile_photo,
    category_scores,
  } = scData;

  const commMetrics = category_scores?.comm_metrics || {};
  const questions = category_scores?.question_breakdown || [];

  const displayQuestions = [];
  for (const qa of questions) {
    if (qa.type === "AUDIO" && qa.is_dummy_audio) break;
    if (qa.type !== "AUDIO" && qa.answer_provided === "") break;
    displayQuestions.push(qa);
  }

  const metrics = [
    { label: "Clarity", value: commMetrics.clarity || 0 },
    { label: "Relevance", value: commMetrics.relevance || 0 },
    { label: "Confidence", value: commMetrics.confidence || 0 },
    { label: "Depth of Thought", value: commMetrics.depth_of_thought || 0 },
    {
      label: "Key Concept Coverage",
      value: commMetrics.key_concept_coverage || 0,
    },
  ];

  const skills = candidate_skills || [];

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="sc-section-main">
      <h3>Here's The Candidate's Scorecard</h3>
      <p className="pp-grey-text">
        Your AI-generated scorecard highlights what went great and where they
        can grow for future roles.
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
            <h3 style={{ textTransform: "capitalize" }}>
              {category_scores?.candidate_role || "N/A"}
            </h3>
          </div>
          <div className="sc-cand-divider" />
          <div className="sc-cand-col sc-cand-col--right">
            <h4>Interview Date</h4>
            <h3>{formattedDate}</h3>
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
                <img src={candidate_profile_photo} alt="candidate" />
                <div className="sc-profile-overlay">
                  <h3>{candidate_name || "Candidate"}</h3>
                  <p style={{ textTransform: "capitalize" }}>
                    {candidate_role || "N/A"}
                  </p>
                </div>
              </div>
              {/* PERFORMANCE CARD */}
              <div className="sc-performance-card">
                <h1>{Math.round(overall_score || 0)}%</h1>
                <h3>Overall Performance Summary</h3>
                <p>Based on {displayQuestions.length} Interview Questions</p>
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
                    <div className="sc-bar-value">{item.value}%</div>
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
                {metrics.map((item, i) => (
                  <span key={i}>{item.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SKILLS */}
          <div className="sc-skills-column">
            <div className="sc-skills-card">
              <h3>Candidate Skills</h3>
              {skills.length === 0 ? (
                <p className="pp-grey-text">No skills tracked.</p>
              ) : (
                <div className="sc-skills-list">
                  {skills.map((skill, i) => (
                    <div key={i} className="sc-skill">
                      <span>{"</>"}</span>
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= INTERVIEW VIDEO ================= */}
        {/* Hiding for now per user request. To be added in the future.
        <div className="sc-video-card">
          <h3>Interview Video</h3>
          <div className="sc-video-wrapper">
            <video src={Demo_video} controls poster={user_pic} />
          </div>
        </div>
        */}

        {/* ================= QUESTIONS & ANSWERS ================= */}
        <div className="sc-qa-section">
          <div className="sc-qa-outer-card">
            <h3 className="sc-qa-heading">Questions & Answers</h3>
            {displayQuestions.length === 0 ? (
              <p className="pp-grey-text">
                No questions found for this interview.
              </p>
            ) : (
              displayQuestions.map((qa, i) => (
                <div key={i} className="sc-qa-card">
                  {/* Type Badge */}
                  <div className="sc-qa-header-row">
                    <span
                      className={`sc-qa-badge sc-qa-badge--${(qa.type || "").toLowerCase()}`}
                    >
                      {qa.type || "UNKNOWN"}
                    </span>
                    <span className="sc-qa-score-pill">
                      Score: {qa.earned_points || 0}/{qa.max_points || 0}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="sc-qa-question">
                    <div className="sc-qa-number">{i + 1}</div>
                    <p>{qa.question_text}</p>
                  </div>

                  {/* Answer */}
                  <div
                    className={`sc-qa-answer sc-qa-answer--${(qa.type || "").toLowerCase()}`}
                  >
                    {qa.type === "MCQ" && (
                      <div className="mcq-options">
                        {qa.options?.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`mcq-option ${qa.answer_provided === opt ? "selected" : ""} ${qa.correct_answer === opt ? "correct" : ""}`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    {(qa.type === "TYPING" || qa.type === "CODING") && (
                      <div className="typing-answer">
                        <strong>Candidate Answer:</strong>
                        <p>{qa.answer_provided || "No answer provided."}</p>
                      </div>
                    )}
                    {qa.type === "AUDIO" && (
                      <div className="sc-qa-audio-wrapper">
                        {qa.candidate_audio_file_url && (
                          <div className="sc-qa-audio-container">
                            <audio
                              controls
                              src={qa.candidate_audio_file_url}
                              className="sc-qa-audio-player"
                              preload="metadata"
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                      </div>
                    )}

                    {qa.transcript && qa.type === "AUDIO" && (
                      <div className="audio-transcript">
                        <strong>Transcript:</strong>
                        <p>{qa.transcript}</p>
                      </div>
                    )}

                    {qa.feedback && (
                      <div className="qa-feedback-box">
                        <strong>AI Feedback:</strong>
                        <p>{qa.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
