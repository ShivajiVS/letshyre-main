import { useState, useRef, useEffect } from "react";
import authService from "@/services/auth.service";

function MobileOtp({ mobile, otpSessionKey, onNext, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [currentSessionKey, setCurrentSessionKey] = useState(otpSessionKey);

  const inputRefs = useRef([]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ===== OTP CHANGE ===== */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const otpArr = otp.split("");
    otpArr[index] = value;

    const newOtp = otpArr.join("").slice(0, 6);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ===== VERIFY OTP ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await authService.verifyMobileOtp({
        phone_number: mobile,
        otp,
        otp_session_key: currentSessionKey,
      });
      onNext();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===== RESEND OTP ===== */
 const handleSendOtp = async (e) => {
  e.preventDefault();
  setError("");

  try {
    setLoading(true);

    const response = await authService.sendMobileOtp({
      phone_number: mobile,
      otp_type: "Registration",
    });

    console.log("SEND OTP RESPONSE:", response.data);

    //  FIX — check correct path from backend
    const sessionKey =
      response?.data?.otp_session_key ||   // most common
      response?.data?.data?.otp_session_key;

    if (!sessionKey) {
      setError("Failed to resend OTP. Please try again.");
      return;
    }

    // update session key for next verification
    setCurrentSessionKey(sessionKey);

    //  reset timer
    setTimer(30);

    //  clear OTP boxes
    setOtp("");
    inputRefs.current[0]?.focus();

    //  success message (optional change color in CSS)
    setError("OTP resent successfully");

  } catch (err) {
    console.log("SEND OTP ERROR:", err);
    setError(
      err?.response?.data?.message ||
      "Failed to resend OTP. Please try again."
    );
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="register-box">
      <h1 className="cl-title">Verification</h1>

      <p className="cl-sub-para">
        Enter the OTP sent to +91 {mobile}
      </p>

      <form className="cl-form" onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {[0, 1, 2, 3, 4, 5].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              className="otp-box"
              value={otp[index] || ""}
              onChange={(e) => {
                handleChange(e.target.value, index);
                setError("");
              }}
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
            />
          ))}
        </div>

        {error && (
          <p
            style={{
              color: error.includes("successfully") ? "green" : "red",
              fontSize: "14px"
            }}
          >
            {error}
          </p>

        )}

        <button className="cl-btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>

      {/* RESEND SECTION */}
      <p className="otp-help-text">Didn’t receive code?</p>

      <p className="form-subtext">
        {timer > 0 ? (
          <>
            Resend -{" "}
            <span className="timer-color">
              00:{timer.toString().padStart(2, "0")}
            </span>
          </>
        ) : (
          <a href="#" onClick={handleSendOtp}>
            Resend OTP
          </a>
        )}
      </p>

      {/* {onBack && (
        <p className="form-subtext">
          <a href="#" onClick={onBack}>
            Back
          </a>  
        </p>
      )} */}
    </div>
  );
}

export default MobileOtp;
