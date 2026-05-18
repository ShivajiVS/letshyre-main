import { useState } from "react";

import RegisterEmail02 from "./RegisterEmail02";
import OtpVerify02 from "./OtpVerify02";
import MobileVerify02 from "./MobileVerify02";
import MobileOtp02 from "./MobileOtp02";
import SetPassword02 from "./SetPassword02";
import RegisterSuccess02 from "./RegisterSuccess02";

import imgEmail from "@/assets/register01.png";
import imgOtp from "@/assets/otp1.png";
import imgMobile from "@/assets/register01.png";
import imgOtp2 from "@/assets/otp1.png";
import imgPassword from "@/assets/password1.png";
import imgSuccess from "@/assets/login-img01.png";

function EmployerRegisterFlow({ onBackToLogin }) {
  const [step, setStep] = useState("email");
  const [animating, setAnimating] = useState(false);

  const [mobileOtpSessionKey, setMobileOtpSessionKey] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  /* ================= REGISTER DATA ================= */
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    emailOtpSessionKey: "",
    phone_number: "",
  });

  /* ================= STEP NAVIGATION ================= */
  const goNext = (nextStep) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 400);
  };

  /* ================= IMAGE MAP ================= */
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
          {/* ================= FORM ================= */}
          <div
            className={`auth-form ${animating ? "slide-out-left" : "slide-in"}`}
          >
            {/* EMAIL STEP */}
            {step === "email" && (
              <RegisterEmail02
                onNext={(data) => {
                  setRegisterData((prev) => ({
                    ...prev,
                    name: data.name, // ✅ FIXED
                    username: data.username, // ✅ FIXED
                    email: data.email,
                    emailOtpSessionKey: data.emailOtpSessionKey,
                  }));
                  goNext("otp");
                }}
              />
            )}

            {/* EMAIL OTP */}
            {step === "otp" && (
              <OtpVerify02
                email={registerData.email}
                otpSessionKey={registerData.emailOtpSessionKey}
                onNext={() => goNext("mobile")}
                onBack={() => goNext("email")}
              />
            )}

            {/* MOBILE NUMBER */}
            {step === "mobile" && (
              <MobileVerify02
                onNext={({ mobile, otpSessionKey }) => {
                  setMobileNumber(mobile);
                  setMobileOtpSessionKey(otpSessionKey);

                  setRegisterData((prev) => ({
                    ...prev,
                    phone_number: mobile, // ✅ SAVE MOBILE
                  }));

                  goNext("mobileOtp");
                }}
                onBack={() => goNext("otp")}
              />
            )}

            {/* MOBILE OTP */}
            {step === "mobileOtp" && (
              <MobileOtp02
                mobile={mobileNumber}
                otpSessionKey={mobileOtpSessionKey}
                onNext={() => goNext("password")}
                onBack={() => goNext("mobile")}
              />
            )}

            {/* SET PASSWORD */}
            {step === "password" && (
              <SetPassword02
                registerData={registerData} // ✅ SEND FULL DATA
                onNext={() => goNext("success")}
              />
            )}

            {/* SUCCESS */}
            {step === "success" && (
              <RegisterSuccess02
                onFinish={() => {
                  window.location.href = "/employer/sign-in";
                }}
              />
            )}
          </div>

          {/* ================= IMAGE ================= */}
          <div
            className={`auth-image ${
              animating ? "slide-out-right" : "slide-in"
            }`}
          >
            <img src={stepImage[step]} alt="Register step" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerRegisterFlow;
