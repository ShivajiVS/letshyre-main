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
            <h4 className="bento-title">AI-Powered Interviews</h4>
            <p className="bento-desc">
              Conduct role-specific interviews anytime, anywhere, through intelligent AI-driven conversations.
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
              Reduce time spent on manual screening and repetitive interview processes.
            </p>
          </div>
        </div>

        {/* Square card */}
        <div className="bento-card">
          <div className="bento-icon-wrapper"><i className="bi bi-graph-up-arrow bento-icon"></i></div>
          <div className="bento-content">
            <h4 className="bento-title">Scalable Recruitment</h4>
            <p className="bento-desc">
              Whether hiring for a single position or multiple roles, LetsHyre helps organizations streamline recruitment at scale, maintaining high-quality talent pipelines.
            </p>
          </div>
        </div>

        {/* Square card */}
        <div className="bento-card bento-highlight">
          <div className="bento-icon-wrapper"><i className="bi bi-search bento-icon"></i></div>
          <div className="bento-content">
            <h4 className="bento-title">Better Discovery</h4>
            <p className="bento-desc">
              Connect with experienced professionals who perfectly match hiring requirements.
            </p>
          </div>
        </div>

        {/* Square card */}
        <div className="bento-card">
          <div className="bento-icon-wrapper"><i className="bi bi-shield-check bento-icon"></i></div>
          <div className="bento-content">
            <h4 className="bento-title">Transparent Process</h4>
            <p className="bento-desc">
              Access structured interview insights that support informed hiring decisions.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
