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
              Access a pool of experienced professionals
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Discover immediate joiners and notice-period candidates
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Conduct role-based AI interviews at scale
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Review structured interview reports and insights
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Reduce hiring timelines and recruitment effort
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
              A platform to showcase professional experience and skills
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Opportunities to be discovered by hiring companies
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              AI-driven interview opportunities aligned with their expertise
            </motion.li>
            <motion.li whileHover={{ x: 5, color: "#10b981" }} transition={{ duration: 0.2 }}>
              <i className="bi bi-check-circle-fill"></i>
              Increased visibility to employers actively looking for experienced talent
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
