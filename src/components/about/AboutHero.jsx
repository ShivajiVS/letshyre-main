import { motion } from "framer-motion";
import heroImg from "@/assets/about_hero.png";

export function AboutHero() {
  return (
    <motion.section
      className="about-hero"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="about-hero-content">
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
      </div>

      <div className="about-hero-visual">
        <div className="visual-glow-orb"></div>
        <motion.img
          src={heroImg}
          alt="HR Professional using LetsHyre"
          className="about-hero-image"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </motion.section>
  );
}
