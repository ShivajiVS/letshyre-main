import { useNavigate } from "react-router";
import { motion } from "framer-motion";

import hire01 from "@/assets/hire-img01.png";

import "./styles/hire-card.css";

export function HireCard() {
  const navigate = useNavigate();

  const titleText = "Ready to Hire or Get Hired?";
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <>
      <section className="hire-card-section">
        <motion.div 
          className="hire-card-main"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hire-card-content">
            <motion.h2 
              variants={containerVariants} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }}
            >
              {titleText.split(" ").map((word, i) => (
                <motion.span 
                  key={i} 
                  variants={wordVariants} 
                  style={{ display: "inline-block", marginRight: "8px" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Empower your career or scale your team with AI. Connect faster and smarter than ever before on a platform built for the future of recruitment.
            </motion.p>
            <div className="buttons-section02">
              <motion.button
                className="job-button02"
                onClick={() => navigate("/employer/sign-in")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Hiring →
              </motion.button>
              <motion.button
                className="hiring-button02"
                onClick={() => navigate("/employee/sign-in")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply for Job →
              </motion.button>
            </div>
          </div>
          <div className="hire-card-img-part">
            <motion.img 
              className="hire-img" 
              src={hire01} 
              alt="Hire" 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="hire-card-inner01"></div>
          <div className="hire-card-inner02"></div>
          <div className="hire-card-inner03"></div>
          <div className="hire-card-inner04"></div>
        </motion.div>
      </section>
    </>
  );
}
