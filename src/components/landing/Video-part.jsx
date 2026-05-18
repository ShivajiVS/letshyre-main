import React from "react";
import Demo_video from "@/assets/Video_part_demo.png";
import "./Video-part.css";

const Video_section = () => {
  return (
    <>
      <div className="vs-heading-section01" id="ai-interview">
        <div className="vs-heading-section">
          <h2>The AI Interview</h2>
          <div className="vs-heading-section-inner">
            <p>
              Letshyre automates resume screening, AI interviews, and candidate
              verification — making hiring faster and smarter.
            </p>
          </div>
        </div>
      </div>

      <div className="video-section-main">
        <div className="Video-Part">
          <img src={Demo_video} alt="" />
        </div>

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
    </>
  );
};
export default Video_section;
