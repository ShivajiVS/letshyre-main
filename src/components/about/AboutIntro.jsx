import { motion } from "framer-motion";

export function AboutIntro() {
  return (
    <motion.section
      className="about-intro"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="about-intro-content">
        <h2 className="about-intro-title">
          The Challenge <br />
          <span className="about-text-gradient">& Our Solution</span>
        </h2>
        <div className="about-intro-text">
          <p>
            Traditional hiring processes often require significant time and
            effort to screen resumes, conduct interviews, and identify the right
            candidates. LetsHyre streamlines this process through intelligent
            candidate screening, AI-powered role-based interviews, interview
            scorecards, and transparent candidate evaluation.
          </p>
          <p>
            Our platform enables employers to unlock candidate profiles,
            interview scorecards, interview recordings, and contact information
            through a simple Pay-Per-Unlock model.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
