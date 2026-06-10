import { motion } from "framer-motion";

export function ContactInfo() {
  return (
    <motion.div
      className="contact-info-section"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="contact-info-title">Get in Touch</h1>
      <p className="contact-info-description">
        Have questions about interviews, candidate reports, hiring plans,
        credits, or technical issues? Our team is here to help.
      </p>

      <div className="contact-info-email-wrapper">
        <span className="contact-info-label">Email Us</span>
        <a href="mailto:support@letshyre.ai" className="contact-info-email">
          support@letshyre.ai
        </a>
      </div>

      <div className="contact-info-privacy">
        <p>
          We value your privacy. By submitting your information, you agree to
          LetsHyre's Privacy Policy, and representatives may contact you.
        </p>
      </div>
    </motion.div>
  );
}
