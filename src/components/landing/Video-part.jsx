import React from "react";
import { motion } from "framer-motion";
import Demo_video from "@/assets/Video_part_demo.png";
import "./styles/video-part.css";

export function VideoSection() {
  return (
    <>
      <motion.div
        className="vs-heading-section01"
        id="ai-interview"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="vs-heading-section">
          <h2>The AI Interview</h2>
          <div className="vs-heading-section-inner">
            <p>
              Letshyre automates resume screening, AI interviews, and candidate
              verification — making hiring faster and smarter.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="video-section-main">
        {/* Background Marquee Texts */}
        <div className="marquee-container">
          {/* Line 1 – Left to Right */}
          <div className="video-BG-Text_box marquee-left">
            <div className="marquee-track">
              <h1 className="Large-text">LETSHYRE LETSHYRE LETSHYRE </h1>
              <h1 className="Large-text">LETSHYRE LETSHYRE LETSHYRE </h1>
            </div>
          </div>

          {/* Line 2 – Right to Left */}
          <div className="video-BG-Text_box marquee-right">
            <div className="marquee-track">
              <h1 className="Large-text">LETSHYRE LETSHYRE LETSHYRE </h1>
              <h1 className="Large-text">LETSHYRE LETSHYRE LETSHYRE </h1>
            </div>
          </div>
        </div>

        {/* Foreground Video/Image */}
        <motion.div
          className="Video-Part"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={Demo_video} alt="AI Interview Demo" />
        </motion.div>
      </div>
    </>
  );
}
