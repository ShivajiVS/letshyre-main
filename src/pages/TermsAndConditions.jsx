import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { toast } from "sonner";
import "./styles/terms-and-conditions.css";

// Helper for Jargon Tooltips
const Tooltip = ({ children, text }) => (
  <span className="tc-tooltip">
    {children}
    <span className="tc-tooltip-text">{text}</span>
  </span>
);

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
          <li>No impersonation or <span className="tc-highlight">fraudulent activity</span> will occur</li>
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
          <li>
            AI-generated interview reports are <Tooltip text="Serving as a sign or suggestion rather than a definitive guarantee."><span className="tc-highlight">indicative only</span></Tooltip>
          </li>
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
          Certain employer services may require paid <span className="tc-highlight">subscriptions</span>.
        </p>
        <p className="tc-section-text">LetsHyre reserves the right to:</p>
        <ul className="tc-list">
          <li>Modify subscription pricing</li>
          <li>Introduce new plans</li>
          <li>Update platform features</li>
        </ul>
        <p className="tc-section-text">
          Changes will apply <Tooltip text="Taking effect from the date of the change going forward.">prospectively</Tooltip> and will not affect completed
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
          platform materials are the <Tooltip text="Creations of the mind, such as software, branding, and proprietary algorithms."><span className="tc-highlight">property of LetsHyre</span></Tooltip>.
        </p>
        <p className="tc-section-text">Users may not:</p>
        <ul className="tc-list">
          <li>Copy platform content</li>
          <li>
            <Tooltip text="Deconstructing software to extract its source code or proprietary logic.">Reverse engineer</Tooltip> platform functionality
          </li>
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
          LetsHyre reserves the right to <span className="tc-highlight">suspend or terminate</span> accounts that:
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
        <p className="tc-section-text">LetsHyre shall <span className="tc-highlight">not be liable</span> for:</p>
        <ul className="tc-list">
          <li>Hiring decisions</li>
          <li>Employment disputes</li>
          <li>Employer-candidate interactions</li>
          <li>Business losses</li>
          <li>
            Indirect or <Tooltip text="Damages that do not flow directly from an act but from some of the consequences of the act.">consequential damages</Tooltip>.
          </li>
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
    <div className="tc-sidebar hide-on-print">
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

// SVG Icons
const UpArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#94a3b8' }}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7"></polyline>
    <polyline points="6 17 11 12 6 7"></polyline>
  </svg>
);

const CollapseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7"></polyline>
    <polyline points="18 17 13 12 18 7"></polyline>
  </svg>
);

export function TermsAndConditions() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  
  // New States for UI/UX enhancements
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0 = small, 1 = normal, 2 = large
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const readTime = useMemo(() => {
    const wordCount = sections.reduce((acc, section) => {
      return acc + section.title.split(" ").length + 30;
    }, 0);
    return Math.ceil(wordCount / 200);
  }, []);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    return sections.filter(sec => 
      sec.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 800);
    
    const checkMobile = () => {
      const mobile = window.innerWidth <= 860;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const scrollToSection = (id) => {
    if (isMobile) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -120;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFeedback = (isHelpful) => {
    setFeedbackGiven(isHelpful ? 'yes' : 'no');
    toast.success("Thank you for your feedback!");
  };

  const changeFontSize = (delta) => {
    setFontSizeLevel(prev => {
      const next = prev + delta;
      return next >= 0 && next <= 2 ? next : prev;
    });
  };

  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const scrollPosition = window.scrollY + 150;
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

  const activeSectionTitle = sections.find(s => s.id === activeSection)?.title || sections[0].title;

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | LetsHyre</title>
        <meta
          name="description"
          content="Terms and Conditions for using LetsHyre. Read our policies on candidate and employer responsibilities, AI interviews, and more."
        />
      </Helmet>

      <div className="hide-on-print">
        <Navbar />
      </div>

      <main className={`tc-container tc-font-level-${fontSizeLevel}`}>
        <motion.div
          className="tc-progress-bar hide-on-print"
          style={{ scaleX }}
        />

        <section className="tc-hero">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Terms & Conditions</h1>
            <div className="tc-hero-badges">
              <span className="tc-read-time hide-on-print">⏱ ~{readTime} min read</span>
              
              <div className="tc-font-controls hide-on-print" title="Adjust Text Size">
                <button 
                  onClick={() => changeFontSize(-1)} 
                  disabled={fontSizeLevel === 0}
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <button 
                  onClick={() => changeFontSize(1)} 
                  disabled={fontSizeLevel === 2}
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>

              <button className="tc-print-btn hide-on-print" onClick={handlePrint}>
                <PrintIcon /> Download PDF
              </button>
            </div>
          </motion.div>
        </section>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className={`tc-wrapper ${sidebarCollapsed && !isMobile ? 'tc-sidebar-collapsed' : ''}`}>
            
            {!isMobile && (
              <aside className="tc-sidebar hide-on-print">
                <div className="tc-sidebar-header">
                  <h3>Contents</h3>
                  <button 
                    className="tc-collapse-btn" 
                    onClick={() => setSidebarCollapsed(true)}
                    title="Collapse Sidebar"
                  >
                    <CollapseIcon />
                  </button>
                </div>
                
                <div className="tc-search-box">
                  <SearchIcon />
                  <input 
                    type="text" 
                    placeholder="Search sections..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <nav>
                  <ul className="tc-sidebar-nav">
                    {filteredSections.map((section) => (
                      <li key={`nav-${section.id}`}>
                        <button
                          className={`tc-sidebar-link ${
                            activeSection === section.id && !searchQuery ? "active" : ""
                          }`}
                          onClick={() => scrollToSection(section.id)}
                          type="button"
                        >
                          {section.title}
                        </button>
                      </li>
                    ))}
                    {filteredSections.length === 0 && (
                      <li className="tc-no-results">No sections match your search.</li>
                    )}
                  </ul>
                </nav>
              </aside>
            )}

            <motion.div
              className="tc-content-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              
              {/* Expand Sidebar Button for Desktop */}
              {!isMobile && sidebarCollapsed && (
                <button 
                  className="tc-expand-btn hide-on-print" 
                  onClick={() => setSidebarCollapsed(false)}
                  title="Expand Sidebar"
                >
                  <ExpandIcon /> Contents
                </button>
              )}

              <AnimatePresence>
                {isMobile && showScrollTop && !searchQuery && (
                  <motion.div 
                    className="tc-mobile-reading-pill hide-on-print"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <span>Reading:</span> {activeSectionTitle.replace(/^\d+\.\s*/, '')}
                  </motion.div>
                )}
              </AnimatePresence>

              {isMobile && (
                <div className="tc-search-box tc-mobile-search hide-on-print">
                  <SearchIcon />
                  <input 
                    type="text" 
                    placeholder="Search sections..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              <p className="tc-intro">
                By accessing or using LetsHyre, you agree to be bound by these
                Terms & Conditions.
              </p>

              {filteredSections.map((section, index) => (
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
                  <div className="tc-section-header">
                    <h2 className="tc-section-title">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="tc-section-body">
                    {section.content}
                  </div>
                </motion.section>
              ))}

              {filteredSections.length > 0 && (
                <div className="tc-feedback-widget hide-on-print">
                  <p>Was this document clear and helpful?</p>
                  <div className="tc-feedback-actions">
                    <button 
                      className={`tc-feedback-btn ${feedbackGiven === 'yes' ? 'active' : ''}`}
                      onClick={() => handleFeedback(true)}
                      disabled={feedbackGiven !== null}
                    >
                      👍 Yes
                    </button>
                    <button 
                      className={`tc-feedback-btn ${feedbackGiven === 'no' ? 'active' : ''}`}
                      onClick={() => handleFeedback(false)}
                      disabled={feedbackGiven !== null}
                    >
                      👎 No
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>

      <div className="hide-on-print">
        <Footer />
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="tc-back-to-top hide-on-print"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            <UpArrowIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
