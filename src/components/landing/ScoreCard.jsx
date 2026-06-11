import React, { useRef, useEffect } from "react";
import { motion, useInView, animate, useMotionValue, useSpring, useTransform } from "framer-motion";
import s_img01 from "@/assets/score01.png";
import s_img02 from "@/assets/score02.png";

import "./styles/score-card.css";

const stats = [
  { target: 98, suffix: "%", isPercentage: true, label: "Accuracy" },
  { target: 3, suffix: "x", isPercentage: false, label: "Faster" },
  { target: 50, suffix: "k+", isPercentage: false, label: "Matches" },
];

const bullets = [
  "Instant AI-driven skill matching",
  "Delivers only the most relevant talent",
  "Cuts through noise and finds true fit",
  "Helping you hire smarter and faster",
];

const progressBars = [
  { label: "Potential Score", value: 87 },
  { label: "Fit Score", value: 94 },
];

function AnimatedCounter({ target, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, target, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [inView, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function handleGlowMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
}

function MagneticTag({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.4); // Subtle pull factor
    y.set((e.clientY - centerY) * 0.4);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className="sc-tag"
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.span>
  );
}

function ParallaxImage({ src, alt }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1200, transformStyle: "preserve-3d", display: 'flex', justifyContent: 'center' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={src} alt={alt} style={{ transform: "translateZ(30px)" }} />
    </motion.div>
  );
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0 }
};

export function ScoreCard() {

  return (
    <section className="sc-main" id="scorecards">
      {/* Background orbs */}
      <div className="sc-orb sc-orb--tr" aria-hidden="true" />
      <div className="sc-orb sc-orb--bl" aria-hidden="true" />

      {/* Header */}
      <div className="sc-header">
        <span className="sc-eyebrow">
          <span className="sc-eyebrow__dot" />
          AI Powered Platform
        </span>
        <h1 className="sc-title">
          AI Powered <span className="sc-title__accent">Scorecard</span> &amp;
          Matching
        </h1>
        <p className="sc-subtitle">
          Smart hiring decisions, powered by intelligence
        </p>
      </div>

      {/* Cards grid */}
      <div className="sc-grid">
        {/* ── LEFT CARD ── */}
        <motion.div
          className="sc-card sc-card--left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleGlowMove}
        >
          <div className="sc-card-glow" />
          <div className="sc-card__img-zone">
            <ParallaxImage src={s_img01} alt="Skill Matching illustration" />
          </div>
          <div className="sc-card__body">
            <MagneticTag>⚡ Feature</MagneticTag>
            <h2 className="sc-card__heading">Skill Matching</h2>
            <motion.ul 
              className="sc-bullets"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {bullets.map((b) => (
                <motion.li key={b} className="sc-bullet" variants={itemVariants}>
                  {b}
                </motion.li>
              ))}
            </motion.ul>
            <div className="sc-stats">
              {stats.map((s) => (
                <div key={s.label} className="sc-stat">
                  <span className={`sc-stat__num ${s.isPercentage ? "sc-percentage" : ""}`}>
                    <AnimatedCounter target={s.target} suffix={s.suffix} />
                  </span>
                  <span className="sc-stat__label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── CENTER CARD (two stacked mini-cards) ── */}
        <motion.div
          className="sc-card sc-card--center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top mini */}
          <div className="sc-mini-card" onMouseMove={handleGlowMove}>
            <div className="sc-card-glow" />
            <MagneticTag>🎯 Smart</MagneticTag>
            <h2 className="sc-card__heading">AI Candidate Screening</h2>
            <motion.ul 
              className="sc-bullets"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.li className="sc-bullet" variants={itemVariants}>Instant AI-driven skill matching</motion.li>
              <motion.li className="sc-bullet" variants={itemVariants}>Delivers only the most relevant talent</motion.li>
              <motion.li className="sc-bullet" variants={itemVariants}>Cuts through noise and finds true fit</motion.li>
            </motion.ul>
          </div>

          {/* Bottom mini – Growth */}
          <div className="sc-mini-card sc-mini-card--growth" onMouseMove={handleGlowMove}>
            <div className="sc-card-glow" />
            <div className="sc-icon-wrap" style={{ position: 'relative' }}>
              <motion.div 
                style={{ position: 'absolute', inset: -4, borderRadius: '18px', border: '2px solid #3a7bd5', zIndex: 0 }}
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div 
                style={{ position: 'absolute', inset: -4, borderRadius: '18px', border: '2px solid #3a7bd5', zIndex: 0 }}
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a4fa0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ position: 'relative', zIndex: 1 }}
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <h2 className="sc-card__heading" style={{ fontSize: "1.15rem" }}>
              Growth Potential
            </h2>
            <p className="sc-card__text">
              Assess best employees. Predictive modelling for maximum growth.
            </p>
            {progressBars.map((bar) => (
              <div key={bar.label} className="sc-progress">
                <div className="sc-progress__label">
                  <span>{bar.label}</span>
                  <span className="sc-percentage"><AnimatedCounter target={bar.value} suffix="%" /></span>
                </div>
                <div className="sc-progress__track">
                  <motion.div
                    className="sc-progress__fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.value}%` }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT CARD ── */}
        <motion.div
          className="sc-card sc-card--right"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleGlowMove}
        >
          <div className="sc-card-glow" />
          <div className="sc-card__body">
            <MagneticTag>📊 Analytics</MagneticTag>
            <h2 className="sc-card__heading">Performance Analytics</h2>
            <motion.ul 
              className="sc-bullets"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.li className="sc-bullet" variants={itemVariants}>Instant AI-driven skill matching</motion.li>
              <motion.li className="sc-bullet" variants={itemVariants}>Delivers only the most relevant talent</motion.li>
              <motion.li className="sc-bullet" variants={itemVariants}>Cuts through noise and finds true fit</motion.li>
              <motion.li className="sc-bullet" variants={itemVariants}>Helping you hire smarter and faster</motion.li>
            </motion.ul>
            <div className="sc-stats">
              <div className="sc-stat">
                <span className="sc-stat__num"><AnimatedCounter target={12} suffix="k" /></span>
                <span className="sc-stat__label">Reports</span>
              </div>
              <div className="sc-stat">
                <span className="sc-stat__num sc-percentage"><AnimatedCounter target={99} suffix="%" /></span>
                <span className="sc-stat__label">Uptime</span>
              </div>
            </div>
          </div>
          <div className="sc-card__img-zone sc-card__img-zone--bottom">
            <ParallaxImage src={s_img02} alt="Performance Analytics illustration" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
