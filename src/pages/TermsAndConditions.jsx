import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import "./styles/terms-and-conditions.css";

const sections = [
  {
    id: "overview",
    title: "1. Platform Overview",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre is an AI-powered hiring platform that helps employers
          discover experienced and immediate-joiner candidates through:
        </p>
        <ul className="tc-list">
          <li>Resume Screening</li>
          <li>Role-Based AI Interviews</li>
          <li>Interview Reports</li>
          <li>Interview Transparency</li>
          <li>Candidate Validation</li>
        </ul>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: (
      <>
        <p className="tc-section-text">Users must:</p>
        <ul className="tc-list">
          <li>Be at least 18 years old</li>
          <li>Provide accurate and complete information</li>
          <li>Use the platform in compliance with applicable laws</li>
        </ul>
      </>
    ),
  },
  {
    id: "candidate-responsibilities",
    title: "3. Candidate Responsibilities",
    content: (
      <>
        <p className="tc-section-text">Candidates agree that:</p>
        <ul className="tc-list">
          <li>All submitted information is accurate and truthful</li>
          <li>Resumes and employment information are genuine</li>
          <li>AI interviews are completed honestly</li>
          <li>No impersonation or fraudulent activity will occur</li>
        </ul>
      </>
    ),
  },
  {
    id: "employer-responsibilities",
    title: "4. Employer Responsibilities",
    content: (
      <>
        <p className="tc-section-text">Employers agree that:</p>
        <ul className="tc-list">
          <li>Job opportunities posted are genuine</li>
          <li>
            Candidate information will be used only for recruitment purposes
          </li>
          <li>Candidate data will not be sold, shared, or misused</li>
          <li>Hiring activities will comply with applicable laws</li>
        </ul>
      </>
    ),
  },
  {
    id: "ai-interview-disclaimer",
    title: "5. AI Interview Disclaimer",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre uses artificial intelligence to conduct role-based interviews
          and generate interview reports.
        </p>
        <p className="tc-section-text">Users acknowledge that:</p>
        <ul className="tc-list">
          <li>AI-generated interview reports are indicative only</li>
          <li>Interview insights may not always be fully accurate</li>
          <li>
            Final hiring decisions remain the sole responsibility of employers
          </li>
        </ul>
        <p className="tc-section-text">LetsHyre does not guarantee:</p>
        <ul className="tc-list">
          <li>Employment opportunities</li>
          <li>Job offers</li>
          <li>Candidate selection</li>
          <li>Hiring outcomes</li>
        </ul>
      </>
    ),
  },
  {
    id: "subscription-services",
    title: "6. Subscription Services",
    content: (
      <>
        <p className="tc-section-text">
          Certain employer services may require paid subscriptions.
        </p>
        <p className="tc-section-text">LetsHyre reserves the right to:</p>
        <ul className="tc-list">
          <li>Modify subscription pricing</li>
          <li>Introduce new plans</li>
          <li>Update platform features</li>
        </ul>
        <p className="tc-section-text">
          Changes will apply prospectively and will not affect completed
          purchases.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: (
      <>
        <p className="tc-section-text">
          All content, software, branding, technology, interview frameworks, and
          platform materials are the property of LetsHyre.
        </p>
        <p className="tc-section-text">Users may not:</p>
        <ul className="tc-list">
          <li>Copy platform content</li>
          <li>Reverse engineer platform functionality</li>
          <li>Redistribute proprietary materials</li>
          <li>Use LetsHyre branding without written permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "prohibited-activities",
    title: "8. Prohibited Activities",
    content: (
      <>
        <p className="tc-section-text">Users shall not:</p>
        <ul className="tc-list">
          <li>Submit false information</li>
          <li>Attempt unauthorized access</li>
          <li>Upload malicious software</li>
          <li>Disrupt platform operations</li>
          <li>Violate applicable laws.</li>
        </ul>
      </>
    ),
  },
  {
    id: "account-suspension",
    title: "9. Account Suspension or Termination",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre reserves the right to suspend or terminate accounts that:
        </p>
        <ul className="tc-list">
          <li>Violate these Terms</li>
          <li>Engage in fraudulent activity</li>
          <li>Misuse platform resources</li>
          <li>Provide false or misleading information.</li>
        </ul>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "10. Limitation of Liability",
    content: (
      <>
        <p className="tc-section-text">LetsHyre shall not be liable for:</p>
        <ul className="tc-list">
          <li>Hiring decisions</li>
          <li>Employment disputes</li>
          <li>Employer-candidate interactions</li>
          <li>Business losses</li>
          <li>Indirect or consequential damages.</li>
        </ul>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "11. Governing Law",
    content: (
      <>
        <p className="tc-section-text">
          These Terms shall be governed by and interpreted under the laws of
          India.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "12. Changes to Terms",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre may revise these Terms periodically. Continued use of the
          platform constitutes acceptance of updated Terms.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "13. Contact Us",
    content: (
      <>
        <div className="tc-contact">
          <p className="tc-section-text">
            Email:{" "}
            <a href="mailto:support@letshyre.com" className="tc-contact-email">
              support@letshyre.com
            </a>
          </p>
        </div>
      </>
    ),
  },
];

const SkeletonLoader = () => (
  <div className="tc-wrapper">
    <div className="tc-sidebar">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={`sk-nav-${i}`}
          className="tc-skeleton tc-sk-sidebar-item"
        ></div>
      ))}
    </div>
    <div className="tc-content-area">
      {[1, 2, 3].map((section) => (
        <div key={`sk-sec-${section}`} style={{ marginBottom: "3rem" }}>
          <div className="tc-skeleton tc-sk-title"></div>
          <div className="tc-skeleton tc-sk-text"></div>
          <div className="tc-skeleton tc-sk-text"></div>
          <div className="tc-skeleton tc-sk-text short"></div>
          <div className="tc-skeleton tc-sk-text shorter"></div>
        </div>
      ))}
    </div>
  </div>
);

export function TermsAndConditions() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    // Simulate loading state for production-ready feeling
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky header if any
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          const absoluteBottom = bottom + window.scrollY;
          if (
            scrollPosition >= absoluteTop &&
            scrollPosition < absoluteBottom
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | LetsHyre</title>
        <meta
          name="description"
          content="Terms and Conditions for using LetsHyre. Read our policies on candidate and employer responsibilities, AI interviews, and more."
        />
      </Helmet>

      <Navbar />

      <main className="tc-container">
        <section className="tc-hero">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Terms & Conditions</h1>
            <span className="tc-last-updated">Last Updated: June 9, 2026</span>
          </motion.div>
        </section>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="tc-wrapper">
            <aside className="tc-sidebar">
              <h3>Contents</h3>
              <nav>
                <ul className="tc-sidebar-nav">
                  {sections.map((section) => (
                    <li key={`nav-${section.id}`}>
                      <button
                        className={`tc-sidebar-link ${activeSection === section.id ? "active" : ""}`}
                        onClick={() => scrollToSection(section.id)}
                        type="button"
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <motion.div
              className="tc-content-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="tc-intro">
                By accessing or using LetsHyre, you agree to be bound by these
                Terms & Conditions.
              </p>

              {sections.map((section, index) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  className="tc-section"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.1, 0.3),
                  }}
                >
                  <h2 className="tc-section-title">{section.title}</h2>
                  {section.content}
                </motion.section>
              ))}
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
