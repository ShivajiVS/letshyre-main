import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import assit01 from "@/assets/assit01.png";
import assit02 from "@/assets/assit02.png";
import assit03 from "@/assets/assit03.png";
import assit04 from "@/assets/assit04.png";
import "./styles/assistance.css";

const STEPS = [
  {
    number: 1,
    pill: "Post your opening",
    heading: ["Define the role,", "let AI do the rest"],
    image: assit01,
    imageAlt: "Post your job opening",
    description:
      "List your job requirements and our AI immediately takes over — automating resume evaluation, conducting scalable interviews, and surfacing your ideal candidate profile for seamless decision-making.",
    link: "Learn how it works",
    layout: "image-first",
    color: "#e6f1fb",
  },
  {
    number: 2,
    pill: "AI Screening",
    heading: ["24/7 interviews,", "zero scheduling friction"],
    image: assit02,
    imageAlt: "AI screening candidates",
    description:
      "Deep, objective assessments of skills, experience, and cultural fit — conducted continuously across every timezone. Consistent, fair, and faster than any manual process.",
    link: "See it in action",
    layout: "text-first",
    color: "#e8f0fe",
  },
  {
    number: 3,
    pill: "Receive Scorecards",
    heading: ["Raw data transformed into", "clear recommendations"],
    image: assit03,
    imageAlt: "Receive AI-generated scorecards",
    description:
      "Comprehensive AI-generated scorecards with prescriptive insights — so you can eliminate guesswork and move decisively toward the best candidate for every role.",
    link: "View a sample scorecard",
    layout: "image-first",
    color: "#eef2ff",
  },
  {
    number: 4,
    pill: "Hire with Confidence",
    heading: ["Predictive indicators,", "not gut feeling"],
    image: assit04,
    imageAlt: "Hire with confidence using data",
    description:
      "PSI-backed scorecards give you a statistical forecast of a candidate's future performance and retention — turning every hiring decision into a data-driven strategic move.",
    link: "Explore PSI scores",
    layout: "text-first",
    color: "#e6f1fb",
  },
];

const TiltImage = ({ src, alt, color }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

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
      className="as-img-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <div
        className="ambient-glow"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <img src={src} alt={alt} loading="lazy" style={{ transform: "translateZ(30px)" }} />
    </motion.div>
  );
};

const StepBlock = ({ step }) => {
  const isImageFirst = step.layout === "image-first";

  return (
    <div className={`as-row ${isImageFirst ? "image-first" : "text-first"}`}>
      <motion.div
        className="as-img"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-20% 0px -20% 0px", amount: "some" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <TiltImage src={step.image} alt={step.imageAlt} color={step.color} />
      </motion.div>

      <motion.div
        className="as-text"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-20% 0px -20% 0px", amount: "some" }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
      >
        <div className="as-pill">
          <span className="as-num" aria-hidden="true">
            {step.number}
          </span>
          {step.pill}
        </div>

        <h2 className="as-heading">
          {step.heading[0]}
          <br />
          <em>{step.heading[1]}</em>
        </h2>

        <p className="as-body">{step.description}</p>

        <a href="#" className="as-link">
          {step.link}{" "}
          <span className="as-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </motion.div>
    </div>
  );
};

export function Assistance() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="as-main" id="how-it-works" aria-label="How it works" ref={containerRef}>
      <div className="as-container">
        {/* Animated Timeline for Desktop */}
        <div className="timeline-track" aria-hidden="true">
          <motion.div className="timeline-fill" style={{ height: lineHeight }} />
        </div>

        {STEPS.map((step) => (
          <StepBlock key={step.number} step={step} />
        ))}
      </div>
    </section>
  );
}
