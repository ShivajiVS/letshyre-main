import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/question-area.css";

export function QuestionArea() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "How does LetsHyre’s AI hiring platform work?",
      a: "LetsHyre instantly parses resumes, conducts interactive AI interviews to assess communication and technical skills, and provides a verified scorecard so you only spend time on top candidates.",
    },
    {
      q: "What makes LetsHyre different from other hiring platforms?",
      a: "Unlike traditional job boards, LetsHyre automates the entire screening process. Our AI verifies skills in real-time before you even see the candidate, drastically reducing your time-to-hire.",
    },
    {
      q: "How accurate is the AI interview evaluation?",
      a: "Our AI models are trained on millions of data points to evaluate communication, technical proficiency, and cultural fit with over 98% accuracy, ensuring fair and unbiased scoring.",
    },
    {
      q: "What does AI video Object Detection check for?",
      a: "Our advanced anti-cheating system monitors eye tracking, detects multiple faces, and checks for unauthorized devices like phones or secondary monitors during the assessment.",
    },
    {
      q: "Are notice-period candidates verified?",
      a: "Yes, we prioritize and verify notice-period candidates so you can build your team up to 40% faster with talent that is ready to join immediately.",
    },
    {
      q: "What information does the AI scorecard include?",
      a: "The scorecard provides a comprehensive breakdown of the candidate's Potential Score, Fit Score, technical strengths, areas for improvement, and a detailed behavioral analysis.",
    },
    {
      q: "Can I integrate LetsHyre with our existing HR systems?",
      a: "Absolutely! LetsHyre seamlessly integrates with popular ATS and HRIS platforms via our secure API, so your hiring workflow remains uninterrupted.",
    },
  ];
  return (
    <motion.section
      className="faq-wrapper"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
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
                  <motion.svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path d="M5 12h14" />
                    <motion.path 
                      d="M12 5v14" 
                      animate={{ opacity: activeIndex === index ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.svg>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    className="faq-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="faq-content-inner">
                      <p>{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
