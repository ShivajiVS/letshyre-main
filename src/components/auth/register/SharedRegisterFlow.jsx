import { useState } from "react";
import { SharedRegisterEmail } from "./SharedRegisterEmail";
import { SharedOtpVerify } from "./SharedOtpVerify";
import { SharedMobileVerify } from "./SharedMobileVerify";
import { SharedMobileOtp } from "./SharedMobileOtp";
import { SharedSetPassword } from "./SharedSetPassword";
import { SharedRegisterSuccess } from "./SharedRegisterSuccess";

import imgEmail from "@/assets/register01.png";
import imgOtp from "@/assets/otp1.png";
import imgMobile from "@/assets/register01.png";
import imgOtp2 from "@/assets/otp1.png";
import imgPassword from "@/assets/password1.png";
import imgSuccess from "@/assets/login-img01.png";

import "@/pages/employee/auth/styles/auth-register.css";

export function SharedRegisterFlow({ role }) {
  const [step, setStep] = useState("email");
  const [animating, setAnimating] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    emailOtpSessionKey: "",
    phone_number: "",
    mobileOtpSessionKey: "",
  });

  const goNext = (nextStep) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 400);
  };

  const stepImage = {
    email: imgEmail,
    otp: imgOtp,
    mobile: imgMobile,
    mobileOtp: imgOtp2,
    password: imgPassword,
    success: imgSuccess,
  };

  return (
    <div className="candidate-page-main">
      <div className="candidate-page">
        <div className="cl-ball022"></div>

        <div className="auth-card">
          {/* ================= FORM SECTION ================= */}
          <div
            className={`auth-form ${animating ? "slide-out-left" : "slide-in"}`}
          >
            {step === "email" && (
              <SharedRegisterEmail
                role={role}
                onNext={(data) => {
                  setRegisterData((prev) => ({
                    ...prev,
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    emailOtpSessionKey: data.emailOtpSessionKey,
                  }));
                  goNext("otp");
                }}
              />
            )}

            {step === "otp" && (
              <SharedOtpVerify
                role={role}
                email={registerData.email}
                otpSessionKey={registerData.emailOtpSessionKey}
                onNext={() => goNext("mobile")}
              />
            )}

            {step === "mobile" && (
              <SharedMobileVerify
                role={role}
                onNext={({ mobile, otpSessionKey }) => {
                  setRegisterData((prev) => ({
                    ...prev,
                    phone_number: mobile,
                    mobileOtpSessionKey: otpSessionKey,
                  }));
                  goNext("mobileOtp");
                }}
              />
            )}

            {step === "mobileOtp" && (
              <SharedMobileOtp
                role={role}
                mobile={registerData.phone_number}
                otpSessionKey={registerData.mobileOtpSessionKey}
                onNext={() => goNext("password")}
              />
            )}

            {step === "password" && (
              <SharedSetPassword
                role={role}
                registerData={registerData}
                onNext={() => goNext("success")}
              />
            )}

            {step === "success" && <SharedRegisterSuccess role={role} />}
          </div>

          {/* ================= IMAGE SECTION ================= */}
          <div
            className={`auth-image ${animating ? "slide-out-right" : "slide-in"}`}
          >
            <img src={stepImage[step]} alt="Registration step" />
          </div>
        </div>
      </div>
    </div>
  );
}
