import { motion } from "framer-motion";

export function AboutWhatWeDo() {
  return (
    <motion.section
      className="about-whatwedo"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="about-card">
        <h3 className="about-card-title">
          <div className="about-card-icon">
            <i className="bi bi-building"></i>
          </div>
          For Employers
        </h3>
        <ul className="about-list">
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Access a pool of experienced professionals
          </li>
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Discover immediate joiners and notice-period candidates
          </li>
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Conduct role-based AI interviews at scale
          </li>
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Review structured interview reports and insights
          </li>
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Reduce hiring timelines and recruitment effort
          </li>
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Improve hiring efficiency and decision-making
          </li>
        </ul>
      </div>

      <div className="about-card">
        <h3 className="about-card-title">
          <div className="about-card-icon">
            <i className="bi bi-person-badge"></i>
          </div>
          For Candidates
        </h3>
        <ul className="about-list">
          <li>
            <i className="bi bi-check-circle-fill"></i>
            A platform to showcase professional experience and skills
          </li>
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Opportunities to be discovered by hiring companies
          </li>
          <li>
            <i className="bi bi-check-circle-fill"></i>
            AI-driven interview opportunities aligned with their expertise
          </li>
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Increased visibility to employers actively looking for experienced talent
          </li>
        </ul>
      </div>
    </motion.section>
  );
}
