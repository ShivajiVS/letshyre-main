import { motion } from "framer-motion";

export function ContactInfo() {
  return (
    <motion.div
      className="contact-info-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="contact-visual-glow"></div>

      <div className="contact-info-badge">
        <span className="contact-info-badge-highlight">Support</span> Help
        Center
      </div>

      <h1 className="contact-info-title">
        Get in Touch <br />
        <span className="contact-text-gradient">With Our Team</span>
      </h1>

      <p className="contact-info-description">
        Have questions about AI interviews, candidate reports, hiring plans,
        credits, or technical issues? Our support specialists are here to help.
      </p>

      <div className="contact-info-email-wrapper">
        <span className="contact-info-label">Email</span>
        <a href="mailto:support@letshyre.ai" className="contact-info-email">
          <div className="contact-icon-wrapper">
            <i className="bi bi-envelope-fill"></i>
          </div>
          support@letshyre.ai
        </a>
      </div>
    </motion.div>
  );
}
