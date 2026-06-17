import { useRef } from "react";
import { motion } from "framer-motion";

export function AboutWhy() {
  const gridRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".bento-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="about-why-title">Why LetsHyre?</h2>
      
      <div className="bento-grid" ref={gridRef} onMouseMove={handleMouseMove}>
        {/* Top wide card */}
        <div className="bento-card bento-wide">
          <div className="bento-content">
            <h4 className="bento-title">AI-Powered Hiring</h4>
            <p className="bento-desc">
              Role-based AI interviews help employers evaluate candidates more efficiently.
            </p>
          </div>
          <div className="bento-icon-wrapper"><i className="bi bi-robot bento-icon"></i></div>
        </div>

        {/* Square card */}
        <div className="bento-card">
          <div className="bento-icon-wrapper"><i className="bi bi-lightning-charge bento-icon"></i></div>
          <div className="bento-content">
            <h4 className="bento-title">Faster Hiring</h4>
            <p className="bento-desc">
              Reduce manual screening effort and accelerate hiring decisions.
            </p>
          </div>
        </div>

        {/* Square card */}
        <div className="bento-card">
          <div className="bento-icon-wrapper"><i className="bi bi-graph-up-arrow bento-icon"></i></div>
          <div className="bento-content">
            <h4 className="bento-title">Experienced Talent Network</h4>
            <p className="bento-desc">
              Connect with immediate joiners, notice-period professionals, and experienced candidates actively seeking opportunities.
            </p>
          </div>
        </div>

        {/* Square card */}
        <div className="bento-card bento-highlight">
          <div className="bento-icon-wrapper"><i className="bi bi-search bento-icon"></i></div>
          <div className="bento-content">
            <h4 className="bento-title">Pay-Per-Unlock Model</h4>
            <p className="bento-desc">
              Pay only when you choose to unlock candidate information relevant to your hiring needs.
            </p>
          </div>
        </div>

        {/* Square card */}
        <div className="bento-card">
          <div className="bento-icon-wrapper"><i className="bi bi-shield-check bento-icon"></i></div>
          <div className="bento-content">
            <h4 className="bento-title">Interview Transparency</h4>
            <p className="bento-desc">
              Structured interview scorecards and insights support informed hiring decisions.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
