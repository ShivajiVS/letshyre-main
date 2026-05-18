import { useState, useRef, useEffect } from "react";
import authService from "@/services/auth.service";

function ForgotOtp({ email, otpSessionKey, onNext }) {

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // ⭐ important
  const [currentSessionKey, setCurrentSessionKey] = useState(otpSessionKey);

  const inputRefs = useRef([]);

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ================= TIMER ================= */
  useEffect(() => {

    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  /* ================= OTP INPUT ================= */
  const handleChange = (value, index) => {

    if (!/^\d?$/.test(value)) return;

    const otpArray = otp.split("");
    otpArray[index] = value;

    const newOtp = otpArray.join("").slice(0, 6);
    setOtp(newOtp);
    setError("");

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

    if (otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    try {

      setLoading(true);
      setError("");

      await authService.verifyEmailOtp({
        email,
        otp,
        otp_session_key: currentSessionKey,
        otp_type: "Forgot Password"
      });

      onNext();

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {
      setLoading(false);
    }

  };

  /* ================= RESEND OTP ================= */
  const handleResend = async (e) => {

    e.preventDefault();

    if (resending) return;

    try {

      setResending(true);
      setError("");

      const res = await authService.sendRegisterEmailOtp({
        email,
        otp_type: "Forgot Password"
      });

      // ⭐ IMPORTANT — update session key
      const newSessionKey = res?.data?.otp_session_key;

      if (!newSessionKey) {
        throw new Error("OTP session key missing");
      }

      setCurrentSessionKey(newSessionKey);

      // reset UI
      setOtp("");
      setTimer(30);
      inputRefs.current[0]?.focus();

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Failed to resend OTP"
      );

    } finally {

      setResending(false);

    }

  };

  return (
    <div className="register-box">

      <h1 className="cl-title">Verification</h1>

      <p className="cl-sub-para">
        Enter the OTP sent to your email
      </p>

      <form className="cl-form" onSubmit={handleSubmit}>

        <div className="otp-inputs">

          {[0,1,2,3,4,5].map((_, i) => (

            <input
              key={i}
              ref={(el)=>inputRefs.current[i]=el}
              className="otp-box"
              type="text"
              maxLength="1"
              value={otp[i] || ""}
              onChange={(e)=>handleChange(e.target.value,i)}
              onKeyDown={(e)=>handleKeyDown(e,i)}
            />

          ))}

        </div>

        {error && (
          <p style={{ color:"red", fontSize:14 }}>
            {error}
          </p>
        )}

        <button className="cl-btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

      </form>

      <p className="form-subtext">

        {timer > 0 ? (
          <>
            Resend in{" "}
            <span className="timer-color">
              00:{timer.toString().padStart(2,"0")}
            </span>
          </>
        ) : (
          <a
            href="#"
            onClick={handleResend}
            style={{
              opacity: resending ? 0.6 : 1,
              pointerEvents: resending ? "none" : "auto"
            }}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </a>
        )}

      </p>

    </div>
  );
}

export default ForgotOtp;