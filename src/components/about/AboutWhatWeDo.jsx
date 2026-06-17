import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import employersImg from "@/assets/employers_illustration.png";
import candidatesImg from "@/assets/candidates_illustration.png";

export function AboutWhatWeDo() {
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);

  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: containerRef1,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress1, [0, 1], [-40, 40]);

  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: containerRef2,
    offset: ["start end", "end start"],
  });
  const y2 = useTransform(scrollYProgress2, [0, 1], [-40, 40]);
  return (
    <section className="about-zigzag-section">
      {/* Row 1: Employers */}
      <motion.div
        className="zigzag-row"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="zigzag-content">
          <h2>For Employers</h2>
          <ul className="zigzag-list">
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Access experienced professionals actively seeking opportunities
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Discover immediate joiners and notice-period candidates
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Conduct AI-powered role-based interviews
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Review interview scorecards and insights
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Interview Recordings
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Reduce hiring effort and screening time
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Access transparent candidate information
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Pay only for the candidate profiles you choose to unlock
            </motion.li>
          </ul>
        </div>
        <div className="zigzag-visual" ref={containerRef1}>
          <motion.img 
            style={{ y: y1 }}
            src={employersImg} 
            alt="Employers AI Dashboard" 
            className="zigzag-image" 
          />
        </div>
      </motion.div>

      {/* Row 2: Candidates */}
      <motion.div
        className="zigzag-row reverse"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="zigzag-content">
          <h2>For Candidates</h2>
          <ul className="zigzag-list">
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Create a professional profile
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Showcase skills and experience
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Participate in AI-powered role-based interviews
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Improve profile visibility
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Increase opportunities to be discovered by employers
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Connect with companies hiring experienced professionals
            </motion.li>
          </ul>
        </div>
        <div className="zigzag-visual" ref={containerRef2}>
          <motion.img 
            style={{ y: y2 }}
            src={candidatesImg} 
            alt="Candidates AI Matching" 
            className="zigzag-image" 
          />
        </div>
      </motion.div>
    </section>
  );
}
