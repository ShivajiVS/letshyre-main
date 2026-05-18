import { useState } from "react";
import { useLocation } from "react-router";

import imgEmail from "@/assets/forgot1.png";
import imgOtp from "@/assets/otp1.png";
import imgPassword from "@/assets/password1.png";
import imgSuccess from "@/assets/login-img01.png";
import ForgotEmail from "./components/ForgotEmail";
import ForgotOtp from "./components/ForgotOtp";
import ForgotResetPassword from "./components/ResetPassword";
import ForgotSuccess from "./components/ForgotSuccess";

import "./ForgotPassword.css";

export function ForgotPassword({ onBackToLogin }) {
  const [step, setStep] = useState("email");
  const [animating, setAnimating] = useState(false);

  const location = useLocation();
  const role = location.state?.role || "candidate";

  const [email, setEmail] = useState("");
  const [otpSessionKey, setOtpSessionKey] = useState("");

  const goNext = (next) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 400);
  };

  const stepImage = {
    email: imgEmail,
    otp: imgOtp,
    password: imgPassword,
    success: imgSuccess,
  };

  return (
    <div className="candidate-page-main">
      <div className="candidate-page">
        <div className="auth-card">
          {/* IMAGE */}
          <div
            className={`auth-image ${animating ? "slide-out-left" : "slide-in"}`}
          >
            <img src={stepImage[step]} alt="Forgot Step" />
          </div>

          {/* FORM */}
          <div
            className={`auth-form ${animating ? "slide-out-right" : "slide-in"}`}
          >
            {step === "email" && (
              <ForgotEmail
                onNext={({ email, otpSessionKey }) => {
                  setEmail(email);
                  setOtpSessionKey(otpSessionKey);
                  goNext("otp");
                }}
                onBack={onBackToLogin}
              />
            )}

            {step === "otp" && (
              <ForgotOtp
                email={email}
                otpSessionKey={otpSessionKey}
                onNext={() => goNext("password")}
                onBack={() => goNext("email")}
              />
            )}

            {step === "password" && (
              <ForgotResetPassword
                email={email}
                otpSessionKey={otpSessionKey}
                onNext={() => goNext("success")}
              />
            )}

            {step === "success" && <ForgotSuccess role={role} />}
          </div>
        </div>

        <div className="cl-ball01"></div>
        <div className="cl-ball02"></div>
      </div>
    </div>
  );
}
