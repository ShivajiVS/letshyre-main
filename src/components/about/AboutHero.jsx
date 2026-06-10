import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <motion.section
      className="about-hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="about-visual-glow"></div>
      <div className="about-hero-badge">About LetsHyre</div>
      <h1 className="about-hero-title">
        Redefining Hiring with <br />
        <span className="about-text-gradient">AI-Powered Interviews</span>
      </h1>
      <p className="about-hero-lead">
        LetsHyre is an AI-powered hiring platform built to help employers
        discover, evaluate, and hire experienced professionals faster and more
        efficiently.
      </p>
      
      <div className="about-hero-text-grid">
        <div className="about-hero-text-block">
          <p>
            Traditional hiring often involves reviewing hundreds of resumes,
            coordinating multiple interview rounds, and spending significant time
            identifying the right candidates. LetsHyre simplifies this process by
            combining intelligent candidate screening with role-based AI interviews,
            enabling employers to focus on hiring the best talent rather than
            managing lengthy recruitment workflows.
          </p>
        </div>
        
        <div className="about-hero-text-block">
          <p>
            Our platform is designed specifically for experienced professionals,
            including immediate joiners and candidates serving notice periods,
            making it easier for organizations to connect with talent that is ready
            to contribute from day one.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
