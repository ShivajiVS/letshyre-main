import { useEffect, useRef, useState } from "react";
import authService from "@/services/auth.service";
import "./registerFlow.css";

function OtpVerify({
  email,
  otpSessionKey,
  onNext,
  onBack,
  subtitle = "Enter the OTP we sent to your email",
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // ✅ success/info message
  const [timer, setTimer] = useState(30);
  const [currentSessionKey, setCurrentSessionKey] = useState(otpSessionKey);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
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

    try {
      setLoading(true);

      await authService.verifyEmailOtp({
        email,
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
    if (resending) return;

    setError("");
    setInfo("");

    try {
      setResending(true);

      const response = await authService.sendRegisterEmailOtp({
        email,
        otp_type: "Registration",
      });

      const newSessionKey =
        response?.data?.otp_session_key ||
        response?.data?.data?.otp_session_key;

      if (!newSessionKey) {
        setError("Failed to resend OTP. Please try again.");
        return;
      }

      // ✅ update session key
      setCurrentSessionKey(newSessionKey);

      // ✅ reset UI
      setOtp("");
      setTimer(30);
      setInfo("OTP resent successfully");
      inputRefs.current[0]?.focus();

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Verification</h1>
      <p className="cl-sub-para">{subtitle}</p>

      <form className="cl-form" onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {[0,1,2,3,4,5].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              className="otp-box"
              value={otp[index] || ""}
              onChange={(e)=>handleChange(e.target.value,index)}
              onKeyDown={(e)=>handleKeyDown(e,index)}
            />
          ))}
        </div>

        {/* messages */}
        {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}
        {info && <p style={{ color: "green", fontSize: 14 }}>{info}</p>}

        <button className="cl-btn button01" disabled={loading}>
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
          <a
            href="#"
            onClick={handleResendOtp}
            style={{ pointerEvents: resending ? "none" : "auto", opacity: resending ? 0.6 : 1 }}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </a>
        )}
      </p>

      {/* {onBack && (
        <p className="form-subtext">
          <a href="#" onClick={onBack}>Back</a>
        </p>
      )} */}
    </div>
  );
}

export default OtpVerify;
