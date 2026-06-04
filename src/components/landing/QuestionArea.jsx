import { useState } from "react";
import "./styles/question-area.css";

export function QuestionArea() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "How does LetsHyre’s AI hiring platform work?",
      a: "Letshyre instantly evaluates resumes, conducts AI interviews, and verifies candidates to help companies hire smarter and faster.",
    },
    {
      q: "What makes LetsHyre different from other hiring platforms?",
      a: "Letshyre instantly evaluates resumes, conducts AI interviews, and verifies candidates to help companies hire smarter and faster.",
    },
    {
      q: "How accurate is the AI interview evaluation?",
      a: "Letshyre instantly evaluates resumes, conducts AI interviews, and verifies candidates to help companies hire smarter and faster.",
    },
    {
      q: "What does AI video Object Detection check for?",
      a: "Letshyre instantly evaluates resumes, conducts AI interviews, and verifies candidates to help companies hire smarter and faster.",
    },
    {
      q: "Are notice-period candidates verified?",
      a: "Letshyre instantly evaluates resumes, conducts AI interviews, and verifies candidates to help companies hire smarter and faster.",
    },
    {
      q: "What information does AI scorecard include?",
      a: "Letshyre instantly evaluates resumes, conducts AI interviews, and verifies candidates to help companies hire smarter and faster.",
    },
    {
      q: "Can i integrate LetsHyre with our existing HR systems?",
      a: "Letshyre instantly evaluates resumes, conducts AI interviews, and verifies candidates to help companies hire smarter and faster.",
    },
  ];
  return (
    <section className="faq-wrapper">
      <div className="faq-container">
        <header className="faq-header-group">
          <span className="faq-label">Support</span>
          <h2 className="faq-title">FAQ: AI Hiring & Notice Period</h2>
          <p className="faq-subtitle">
            Everything you need to know about LetsHyre’s AI-Powered hiring
            platform.
          </p>
        </header>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <div
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              key={index}
            >
              <button
                className="faq-trigger"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span className="faq-question-text">{item.q}</span>
                <span className="faq-icon-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>

              <div className="faq-content">
                <div className="faq-content-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
