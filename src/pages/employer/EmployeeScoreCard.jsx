import sc_bg from "@/assets/scorecard-bg.png";
import user_pic from "@/assets/user-pic.jpeg";
import Demo_video from "@/assets/Video_part_demo.png";

import "./EmployeeScoreCard.css";

export function EmployeeScoreCard() {
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

  const qaList = [
    {
      type: "MCQ",
      question:
        "You are tasked with designing a rate limiter for an API service that must handle thousands of requests per second. which of the following approaches would be the most efficient",
      answer:
        "A. Use a simple in-memory counter to track requests for each user and reset it every minute.",
    },
    {
      type: "TYPING",
      question:
        "You are tasked with designing a rate limiter for an API service that must handle thousands of requests per second. which of the following approaches would be the most efficient",
      answer:
        "I think distributed system use a simple in-memory counter to track requests for each user and reset it every minute. I think distributed system use a simple in-memory counter to track requests for each user and reset it every minute. I think distributed system use a simple in-memory counter to track requests for each user and reset it every minute.",
    },
    {
      type: "MCQ_PSEUDOCODE",
      question:
        "You need to implement a function that detects cycles in a directed graph. Your function should return true if a cycle exists, and false otherwise. Which of the following implementations correctly detects cycles in a directed graph using depth-first search (DFS)?",
      answer:
        "function hasCycle(graph): visited = set() for node in graph: if dfs(node, visited): return True return False def dfs(node, visited): if node in visited: return True visited.add(node) for neighbor in graph[node]: if dfs(neighbor, visited): return True visited.remove(node) return False",
    },
    {
      type: "VOICE",
      question:
        "When designing a microservices architecture, what are some of the trade-offs you should consider between using synchronous and asynchronous communication methods? Can you provide examples of scenarios where one might be preferred over the other?",
      answer: "",
      duration: "0:20 / 2:00",
    },

    {
      type: "MCQ",
      question:
        "You are tasked with designing a rate limiter for an API service that must handle thousands of requests per second. which of the following approaches would be the most efficient",
      answer:
        "A. Use a simple in-memory counter to track requests for each user and reset it every minute.",
    },
    {
      type: "MCQ_PSEUDOCODE",
      question:
        "You need to implement a function that detects cycles in a directed graph. Your function should return true if a cycle exists, and false otherwise. Which of the following implementations correctly detects cycles in a directed graph using depth-first search (DFS)?",
      answer:
        "function hasCycle(graph): visited = set() for node in graph: if dfs(node, visited): return True return False def dfs(node, visited): if node in visited: return True visited.add(node) for neighbor in graph[node]: if dfs(neighbor, visited): return True visited.remove(node) return False",
    },
    {
      type: "VOICE",
      question:
        "When designing a microservices architecture, what are some of the trade-offs you should consider between using synchronous and asynchronous communication methods? Can you provide examples of scenarios where one might be preferred over the other?",
      answer: "",
      duration: "0:20 / 2:00",
    },
    {
      type: "TYPING",
      question:
        "You are tasked with designing a rate limiter for an API service that must handle thousands of requests per second. which of the following approaches would be the most efficient",
      answer:
        "I think distributed system use a simple in-memory counter to track requests for each user and reset it every minute. I think distributed system use a simple in-memory counter to track requests for each user and reset it every minute. I think distributed system use a simple in-memory counter to track requests for each user and reset it every minute.",
    },
  ];

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
            <h3>G Pratyusha</h3>
          </div>
          <div className="sc-cand-divider" />
          <div className="sc-cand-col">
            <h4>Role Applied For</h4>
            <h3>Frontend Developer</h3>
          </div>
          <div className="sc-cand-divider" />
          <div className="sc-cand-col sc-cand-col--right">
            <h4>Interview Date</h4>
            <h3>Jan 02, 2026</h3>
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
                <img src={user_pic} alt="candidate" />
                <div className="sc-profile-overlay">
                  <h3>Yami Gowtham</h3>
                  <p>UI/UX Designer</p>
                </div>
              </div>
              {/* PERFORMANCE CARD */}
              <div className="sc-performance-card">
                <h1>87%</h1>
                <h3>Overall Performance Summary</h3>
                <p>Based on 10 Interview Questions</p>
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

        {/* ================= INTERVIEW VIDEO ================= */}
        <div className="sc-video-card">
          <h3>Interview Video</h3>
          <div className="sc-video-wrapper">
            <video src={Demo_video} controls poster={user_pic} />
          </div>
        </div>

        {/* ================= QUESTIONS & ANSWERS ================= */}
        <div className="sc-qa-section">
          <div className="sc-qa-outer-card">
            <h3 className="sc-qa-heading">Questions & Answers</h3>
            {qaList.map((qa, i) => (
              <div key={i} className="sc-qa-card">
                {/* Type Badge */}
                <span
                  className={`sc-qa-badge sc-qa-badge--${qa.type.toLowerCase()}`}
                >
                  {qa.type}
                </span>

                {/* Question */}
                <div className="sc-qa-question">
                  <div className="sc-qa-number">{i + 1}</div>
                  <p>{qa.question}</p>
                </div>

                {/* Answer */}
                <div
                  className={`sc-qa-answer sc-qa-answer--${qa.type.toLowerCase()}`}
                >
                  {qa.type === "MCQ" && <p>{qa.answer}</p>}
                  {qa.type === "TYPING" && <p>{qa.answer}</p>}
                  {qa.type === "MCQ_PSEUDOCODE" && <code>{qa.answer}</code>}
                  {qa.type === "VOICE" && (
                    <div className="sc-qa-voice">
                      <div className="sc-qa-voice-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                      </div>
                      <div className="sc-qa-voice-bar">
                        <div
                          className="sc-qa-voice-progress"
                          style={{ width: "17%" }}
                        />
                      </div>
                      <span className="sc-qa-voice-time">{qa.duration}</span>
                      <div className="sc-qa-voice-pause">
                        <span />
                        <span />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
