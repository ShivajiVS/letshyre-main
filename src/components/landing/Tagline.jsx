import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./styles/tagline.css";

const Tagline = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <div className="tagline-wrapper" ref={containerRef}>
      <motion.h2 
        className="tagline-text"
        style={{ scale, opacity }}
      >
        <motion.span 
          className="tag-light"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-20%" }}
        >
          Stop Screening.
        </motion.span>{" "}
        <motion.span 
          className="tag-bold"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-20%" }}
        >
          Start Shortlisting.
        </motion.span>
      </motion.h2>
    </div>
  );
};

export default Tagline;
