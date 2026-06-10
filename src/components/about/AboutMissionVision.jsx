import { motion } from "framer-motion";

export function AboutMissionVision() {
  return (
    <motion.section
      className="about-mission-vision"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="about-mv-card">
        <div className="about-mv-icon">
          <i className="bi bi-bullseye"></i>
        </div>
        <h3 className="about-mv-title">Our Mission</h3>
        <p className="about-mv-desc">
          To make hiring faster, smarter, and more transparent by leveraging
          artificial intelligence and automation while keeping human
          decision-making at the center of recruitment.
        </p>
      </div>

      <div className="about-mv-card">
        <div className="about-mv-icon">
          <i className="bi bi-eye"></i>
        </div>
        <h3 className="about-mv-title">Our Vision</h3>
        <p className="about-mv-desc">
          To become the trusted global hiring marketplace for experienced
          professionals, enabling organizations to find qualified talent
          efficiently and helping candidates connect with meaningful career
          opportunities.
        </p>
      </div>
    </motion.section>
  );
}
