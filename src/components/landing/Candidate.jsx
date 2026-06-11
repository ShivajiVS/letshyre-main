import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Cand01 from "@/assets/Cand01.png";
import Cand02 from "@/assets/Cand02.png";
import Cand03 from "@/assets/Cand03.png";
import Cand04 from "@/assets/Cand04.png";

import "./styles/candidate.css";

export function Candidate() {
  const images = [Cand01, Cand02, Cand03, Cand04];

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  /* ⭐ CHANGE AUTO SLIDE TIME HERE */
  const AUTO_TIME = 3000; // 3 seconds

  /* AUTO ANIMATION */
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(activeIndex);
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, AUTO_TIME);

    return () => clearInterval(interval);
  }, [activeIndex]);

  /* CLICK SELECT */
  const handleSelect = (index) => {
    if (index === activeIndex) return;
    setPrevIndex(activeIndex);
    setActiveIndex(index);
  };

  return (
    <>
      <div className="vs-heading-section01">
        <div className="vs-heading-section">
          <p style={{ color: "#6296EF" }}>For Candidate</p>
          <h2>
            Your Dream Job <br /> Matched by AI
          </h2>
        </div>
      </div>
      <div className="Candidate-Layout">
        {/* ================= LEFT IMAGE SLIDER ================= */}
        <div className="Candidate-img-section01">
          <div className="Candidate-img-section02">
            <div className="Candidate-img-section03">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className={`candidate-slide
                  ${index === activeIndex ? "active" : ""}
                  ${index === prevIndex ? "exit" : ""}
                `}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT CARDS ================= */}
        <div className="Candidate-matter-section">
          {[
            {
              icon: "bi-person-workspace",
              title: "Take AI Interview",
              desc: "Complete a conversational AI interview anytime, anywhere. Boost your opportunities with a seamless and flexible experience.",
            },
            {
              icon: "bi-bookmark-star-fill",
              title: "Instant Evaluation",
              desc: "Experience truly instant evaluation. Gain quick, clear insights into your performance and capabilities.",
            },
            {
              icon: "bi-journal-check",
              title: "Smart Matching",
              desc: "Smart matching that works for you. Our AI connects you to opportunities aligned with your skills and career goals.",
            },
            {
              icon: "bi-people-fill",
              title: "Get Hired Faster",
              desc: "Experience intelligent matching that finds opportunities suited to your strengths and aspirations. Avoid lengthy screening and connect directly with the right recruiters.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`candidate-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => handleSelect(index)}
            >
              <h3>
                <i className={`bi ${item.icon} Cand-icon`}></i> {item.title}
              </h3>
              <p>{item.desc}</p>
              <div className="progress-line">
                {activeIndex === index && (
                  <motion.div
                    className="progress-line-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTO_TIME / 1000, ease: "linear" }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
