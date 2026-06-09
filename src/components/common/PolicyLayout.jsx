import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { toast } from "sonner";
import "@/pages/styles/policy-layout.css";

import { SkeletonLoader } from "@/components/TermsAndConditions/SkeletonLoader";
import { UpArrowIcon, PrintIcon, SearchIcon, ExpandIcon, CollapseIcon } from "@/components/TermsAndConditions/Icons";

export function PolicyLayout({ title, metaDescription, intro, sections }) {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
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
      // rough estimate: parse text from JSX if possible, but title is fine for now, plus 30 words per section assumption
      return acc + section.title.split(" ").length + 40;
    }, 0);
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [sections]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    return sections.filter(sec => 
      sec.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sections]);

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
  }, [loading, sections]);

  const activeSectionTitle = sections.find(s => s.id === activeSection)?.title || sections[0]?.title || "";

  return (
    <>
      <Helmet>
        <title>{title} | LetsHyre</title>
        <meta
          name="description"
          content={metaDescription}
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
            <h1>{title}</h1>
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
                {intro}
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
