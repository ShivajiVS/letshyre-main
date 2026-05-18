import React, { useEffect, useState } from "react";
import Cand01 from "@/assets/Cand01.png";
import Cand02 from "@/assets/Cand02.png";
import Cand03 from "@/assets/Cand03.png";
import Cand04 from "@/assets/Cand04.png";

import "./Candidate.css";

const Candidate = () => {
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
          <div
            className={`candidate-item ${activeIndex === 0 ? "active" : ""}`}
            onClick={() => handleSelect(0)}
          >
            {/* <div className="cm-icon"> <i className="bi bi-person-workspace Cand-icon"></i> </div> */}
            <>
              <h3 className="candidate-item-text">
                {" "}
                <i className="bi bi-person-workspace Cand-icon"></i> Take AI
                Interview
              </h3>
              <p>
                {" "}
                Complete a conversational AI interview anytime, anywhere. Boost
                your opportunities with a seamless and flexible experience.{" "}
              </p>
            </>

            <div className="progress-line"></div>
          </div>

          <div
            className={`candidate-item ${activeIndex === 1 ? "active" : ""}`}
            onClick={() => handleSelect(1)}
          >
            <h3>
              <i className="bi bi-bookmark-star-fill Cand-icon"></i> Instant
              Evaluation
            </h3>
            <p>
              Experience truly instant evaluation. Gain quick, clear insights
              into your performance and capabilities
            </p>
            <div className="progress-line"></div>
          </div>

          <div
            className={`candidate-item ${activeIndex === 2 ? "active" : ""}`}
            onClick={() => handleSelect(2)}
          >
            <h3>
              <i className="bi bi-journal-check Cand-icon"></i> Smart Matching
            </h3>
            <p>
              Smart matching that works for you. Our AI connects you to
              opportunities aligned with your skills and career goals.
            </p>
            <div className="progress-line"></div>
          </div>

          <div
            className={`candidate-item ${activeIndex === 3 ? "active" : ""}`}
            onClick={() => handleSelect(3)}
          >
            <h3>
              <i className="bi bi-people-fill Cand-icon"></i> Get Hired Faster
            </h3>
            <p>
              Experience intelligent matching that finds opportunities suited to
              your strengths and aspirations.Avoid lengthy screening and connect
              directly with the right recruiters
            </p>
            <div className="progress-line"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Candidate;
