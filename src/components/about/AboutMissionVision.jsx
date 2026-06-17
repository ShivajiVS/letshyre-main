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
      <div className="mv-block">
        <h3 className="mv-title">
          <i className="bi bi-bullseye"></i> Our Mission
        </h3>
        <p className="mv-desc">
          To simplify hiring by combining artificial intelligence with transparent candidate evaluation, helping employers discover qualified talent efficiently while providing experienced professionals with fair opportunities to showcase their capabilities.
        </p>
      </div>

      <div className="mv-block">
        <h3 className="mv-title">
          <i className="bi bi-eye"></i> Our Vision
        </h3>
        <p className="mv-desc">
          To become the most trusted AI-powered hiring marketplace for experienced professionals, enabling employers to make better hiring decisions and helping candidates connect with meaningful career opportunities.
        </p>
      </div>
    </motion.section>
  );
}
