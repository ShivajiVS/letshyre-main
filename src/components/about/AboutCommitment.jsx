import { motion } from "framer-motion";

export function AboutCommitment() {
  return (
    <motion.section
      className="about-commitment"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="about-commitment-bg"></div>
      <h2 className="about-commitment-title">Disclaimer</h2>
      <p className="about-commitment-desc">
        LetsHyre provides AI-assisted interview and candidate screening services. AI-generated scorecards and insights are intended to support hiring decisions and should not be considered the sole basis for employment decisions. Final hiring decisions remain the responsibility of employers.
      </p>
      <p className="about-commitment-highlight" style={{ marginTop: "2rem" }}>
        Contact Us
      </p>
      
      <a 
        href="mailto:support@letshyre.ai"
        className="btn-white-cta" 
        style={{ marginTop: "20px", position: "relative", zIndex: 1, display: "inline-block", textDecoration: "none" }}
      >
        support@letshyre.ai
      </a>
    </motion.section>
  );
}
