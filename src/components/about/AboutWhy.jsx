import { motion } from "framer-motion";

export function AboutWhy() {
  const reasons = [
    {
      title: "Faster Hiring",
      desc: "Reduce time spent on manual screening and repetitive interview processes.",
      icon: "bi-lightning-charge",
    },
    {
      title: "AI-Powered Interviews",
      desc: "Conduct role-specific interviews anytime, anywhere, through intelligent AI-driven conversations.",
      icon: "bi-robot",
    },
    {
      title: "Better Candidate Discovery",
      desc: "Connect with experienced professionals who match hiring requirements.",
      icon: "bi-search",
    },
    {
      title: "Transparent Hiring Process",
      desc: "Access structured interview insights that support informed hiring decisions.",
      icon: "bi-shield-check",
    },
    {
      title: "Scalable Recruitment",
      desc: "Whether hiring for a single position or multiple roles, LetsHyre helps organizations streamline recruitment at scale.",
      icon: "bi-graph-up-arrow",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="about-why-title">Why LetsHyre?</h2>
      <div className="about-why-grid">
        {reasons.map((item, index) => (
          <motion.div
            key={index}
            className="why-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          >
            <div className="why-icon">
              <i className={`bi ${item.icon}`}></i>
            </div>
            <h4 className="why-title">{item.title}</h4>
            <p className="why-desc">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
