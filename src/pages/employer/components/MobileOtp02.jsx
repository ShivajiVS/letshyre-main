import { useState, useRef, useEffect } from "react";
import authService from "@/services/auth.service";

function MobileOtp02({ mobile, otpSessionKey, onNext, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // ✅ FIX: fallback to localStorage
  const [currentSessionKey, setCurrentSessionKey] = useState(
    otpSessionKey || localStorage.getItem("mobile_otp_session") || ""
  );

  const inputRefs = useRef([]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ================= OTP CHANGE ================= */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const otpArr = otp.split("");
    otpArr[index] = value;

    const newOtp = otpArr.join("").slice(0, 6);
    setOtp(newOtp);
    setError("");
    setInfo("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    if (!currentSessionKey) {
      setError("Session expired. Please resend OTP.");
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

  /* ================= RESEND OTP ================= */
  const handleResendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setInfo("");

    try {
      setLoading(true);

      const response = await authService.sendMobileOtp({
        phone_number: mobile,
        otp_type: "Registration",
      });

      console.log("🔥 RESEND RESPONSE:", response);

      // ✅ handle ALL response formats
      const newSessionKey =
        response?.data?.data?.otp_session_key ||
        response?.data?.otp_session_key ||
        response?.otp_session_key ||
        response?.data?.data ||
        response?.data;

      if (!newSessionKey || typeof newSessionKey !== "string") {
        throw new Error("Invalid OTP response structure");
      }

      // ✅ update session key everywhere
      setCurrentSessionKey(newSessionKey);
      localStorage.setItem("mobile_otp_session", newSessionKey);

      // ✅ reset UI
      setOtp("");
      setTimer(30);
      setInfo("OTP resent successfully");

      inputRefs.current[0]?.focus();

    } catch (err) {
      console.error("❌ RESEND ERROR:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
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
        
        {/* OTP INPUTS */}
        <div className="otp-inputs">
          {[0, 1, 2, 3, 4, 5].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              className="otp-box"
              value={otp[index] || ""}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* MESSAGES */}
        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>
            {error}
          </p>
        )}

        {info && (
          <p style={{ color: "green", fontSize: "14px" }}>
            {info}
          </p>
        )}

        {/* BUTTON */}
        <button className="cl-btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>

      {/* RESEND */}
      <p className="otp-help-text">Didn’t receive code?</p>

      <p className="form-subtext">
        {timer > 0 ? (
          <>
            Resend in{" "}
            <span className="timer-color">
              00:{timer.toString().padStart(2, "0")}
            </span>
          </>
        ) : (
          <a href="#" onClick={handleResendOtp}>
            Resend OTP
          </a>
        )}
      </p>

      {/* BACK */}
      {onBack && (
        <p className="form-subtext">
          <a href="#" onClick={onBack}>Back</a>
        </p>
      )}
    </div>
  );
}

export default MobileOtp02;