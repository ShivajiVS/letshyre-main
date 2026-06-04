import React, { useEffect, useRef } from "react";
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
  },
];

const StepBlock = ({ step, setRef }) => {
  const isImageFirst = step.layout === "image-first";

  return (
    <div className={`as-row ${isImageFirst ? "image-first" : "text-first"}`}>
      <div
        className="as-img from-left"
        ref={(el) => setRef(el)}
        style={{ "--delay": `${(step.number - 1) * 0.1}s` }}
      >
        <img src={step.image} alt={step.imageAlt} loading="lazy" />
      </div>

      <div
        className="as-text from-right"
        ref={(el) => setRef(el)}
        style={{ "--delay": `${(step.number - 1) * 0.1 + 0.05}s` }}
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
      </div>
    </div>
  );
};

export function Assistance() {
  const animRefs = useRef([]);

  // Clear refs array on re-render to prevent accumulation
  animRefs.current = [];

  const addToRefs = (el) => {
    if (el && !animRefs.current.includes(el)) {
      animRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px", // Triggers slightly before the item hits the viewport
      },
    );

    animRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="as-main" id="how-it-works" aria-label="How it works">
      <div className="as-container">
        {STEPS.map((step) => (
          <StepBlock key={step.number} step={step} setRef={addToRefs} />
        ))}
      </div>
    </section>
  );
}
