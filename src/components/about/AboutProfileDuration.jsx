import { motion } from "framer-motion";

export function AboutProfileDuration() {
  return (
    <motion.section
      className="about-profile-duration"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="profile-duration-card">
        <div className="duration-content">
          <h2 className="duration-title">Profile Activity Duration</h2>
          <div className="duration-text">
            <p>
              To maintain a high-quality and actively available talent pool, candidate profiles remain active on the platform for up to <strong>90 days</strong> from the date of profile creation.
            </p>
            <p>
              Candidates may update their profile information during this period.
            </p>
            <p>
              After the 90-day period expires, candidate profiles may be permanently removed from the active LetsHyre candidate pool.
            </p>
            <p>
              Candidates who wish to continue using LetsHyre after profile removal may create a new profile, subject to the platform's policies and requirements.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
