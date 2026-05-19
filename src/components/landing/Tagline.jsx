import React, { useEffect, useRef } from "react";
import "./Tagline.css";

const Tagline = () => {
  const startRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          obs.unobserve(entry.target); // run only once
        }
      },
      { threshold: 0.2 },
    );

    if (startRef.current) observer.observe(startRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="tagline-wrapper">
      <h2 className="tagline-text" ref={startRef}>
        <span className="tag-light">Stop Screening.</span>{" "}
        <span className="tag-bold">Start Shortlisting.</span>
      </h2>
    </div>
  );
};

export default Tagline;
