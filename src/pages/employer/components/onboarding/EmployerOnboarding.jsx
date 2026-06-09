import React, { useState } from "react";
import { useNavigate } from "react-router";
import KYCImg from "@/assets/EmployerKYC.png";
import brand from "@/assets/LETSHYRE.png";
import e_demo01 from "@/assets/emp-demo01.png";
import e_demo02 from "@/assets/emp-demo02.png";
import { logoutMe } from "@/services/auth.service";
import { motion } from "framer-motion";

import { OnboardingForm } from "./OnboardingForm";
import "./EmployerOnboarding.css";

export function EmployerOnboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate("/employer");
  };

  const handleLogout = async () => {
    await logoutMe();
    navigate("/employer/sign-in", { replace: true });
  };

  return (
    <div className={`onboard-page ${step === 2 ? "step2" : ""}`}>
      <img src={brand} className="brand-name" alt="brand" />

      <div className={`onboard-wrapper ${step === 2 ? "video-layout" : ""}`}>
        {step === 2 && (
          <>
            <img src={e_demo01} className="demo-image demo-image01" alt="demo" />
            <img src={e_demo02} className="demo-image demo-image02" alt="demo" />
          </>
        )}

        {/* LEFT IMAGE ONLY FOR STEP 1 */}
        {step === 1 && (
          <div className="onboard-left">
            <img src={KYCImg} alt="illustration" />
          </div>
        )}

        {/* RIGHT CARD */}
        <div className="onboard-card">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2>LET'S GET TO KNOW YOU</h2>
              <OnboardingForm onNextStep={() => setStep(2)} />
            </>
          )}

          {/* STEP 2 VIDEO */}
          {step === 2 && (
            <motion.div 
              className="video-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div 
                className="video-box"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="video-frame-glow">
                  <iframe
                    src="https://www.youtube.com/embed/hcNVG7JCxoE?si=pXZhZ-peiVIZ8PnS"
                    title="Intro"
                    allowFullScreen
                  />
                </div>
              </motion.div>

              <motion.div 
                className="video-content"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h3>
                  See How The <br /> <span className="gradient-text">Pro-Recruiters</span> Use LETSHYRE
                </h3>
                <p>
                  Watch our quick walkthrough to maximize your credits and find top talent faster.
                </p>
                <button className="skip-btn" onClick={handleSkip}>
                  Skip For Now <span className="arrow-icon">→</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
