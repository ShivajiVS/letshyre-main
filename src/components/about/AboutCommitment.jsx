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
      <h2 className="about-commitment-title">Our Commitment</h2>
      <p className="about-commitment-desc">
        At LetsHyre, we believe technology should enhance hiring—not replace
        human judgment. Our platform is designed to support employers with
        better information, improve candidate visibility, and create a more
        efficient hiring experience for everyone involved.
      </p>
      <p className="about-commitment-highlight">
        The future of hiring is faster, smarter, and more accessible—and
        LetsHyre is building that future.
      </p>
    </motion.section>
  );
}
