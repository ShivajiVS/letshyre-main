import { motion } from "framer-motion";

export function AboutTrust() {
  const logos = [
    { id: 1, icon: "bi-building-check", name: "Global HR" },
    { id: 2, icon: "bi-buildings", name: "TechCorp" },
    { id: 3, icon: "bi-bank", name: "FinancePro" },
    { id: 4, icon: "bi-hospital", name: "HealthStaff" },
    { id: 5, icon: "bi-shop", name: "RetailConnect" },
  ];

  return (
    <motion.section
      className="about-trust-strip"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
    >
      <p className="trust-strip-title">TRUSTED BY INNOVATIVE HR TEAMS GLOBALLY</p>
      <div className="trust-strip-logos">
        {logos.map((logo) => (
          <div key={logo.id} className="trust-logo-item">
            <i className={`bi ${logo.icon}`}></i>
            <span>{logo.name}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
