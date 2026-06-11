import { useNavigate } from "react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import heroImg from "@/assets/hero1.jpeg";
import first_part_bg from "@/assets/FP_bg.png";
import Tagline from "./Tagline";

import "./styles/hero2.css";

export function Hero2() {
  const navigate = useNavigate();

  // 3D Parallax Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };
  
  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="hero-container" id="home">
      <div className="hero-top-row">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-highlight">New</span> 100% AI-Screened Candidates
          </div>

          <motion.h1 
            className="hero-title"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {"The AI Hiring Platform for".split(" ").map((word, i) => (
              <motion.span key={`line1-${i}`} variants={wordVariants} style={{ display: "inline-block", marginRight: "12px" }}>
                {word}
              </motion.span>
            ))}
            <br />
            {"Notice-Period Talent".split(" ").map((word, i) => (
              <motion.span key={`line2-${i}`} variants={wordVariants} className="text-gradient" style={{ display: "inline-block", marginRight: "12px" }}>
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Letshyre automates resume evaluation, AI interviews, and candidate verification for modern HR teams. Build your dream team faster, without the screening overhead.
          </motion.p>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/employer/sign-in")}
            >
              I'm Hiring <span className="btn-arrow">&rarr;</span>
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/employee/sign-in")}
            >
              I'm looking for a job <span className="btn-arrow">&rarr;</span>
            </button>
          </div>

          <div className="percetage-box">
            <div className="percetage-box-inner01">
              <span>100%</span>
              <p>AI-Verified</p>
            </div>
            <div className="percetage-box-inner02">
              <p className="grey-text">Increase your Hiring by</p>
              <span>40%</span>
              <a href="#categories">See the categories→</a>
            </div>
          </div>
        </div>

        <div className="hero-visual" style={{ perspective: 1200 }}>
          <motion.div 
            className="visual-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              rotateX, 
              rotateY, 
              transformStyle: "preserve-3d",
              transition: "box-shadow 0.3s ease" 
            }}
          >
            <img
              src={heroImg}
              alt="Letshyre Platform"
              className="hero-main-img"
              style={{ transform: "translateZ(40px)" }}
            />
            <div className="visual-glow" style={{ transform: "translateZ(-20px)" }}></div>
          </motion.div>
        </div>
      </div>
      <Tagline />

      {/* Re-using your background shape as a modern ambient gradient blur */}
      <img
        className="hero-bg-shape"
        src={first_part_bg}
        alt=""
        aria-hidden="true"
      />
    </section>
  );
}
