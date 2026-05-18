import { useState } from "react";
import authService from "@/services/auth.service";

function MobileVerify02({ onNext, onBack }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (mobile.length !== 10) {
      setError("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.sendMobileOtp({
        phone_number: mobile,
        otp_type: "Registration",
      });

      console.log("🔥 FULL MOBILE OTP RESPONSE:", response);

      /**
       * ✅ Handle ALL possible API formats
       */
      const sessionKey =
        response?.data?.data?.otp_session_key ||  // nested object
        response?.data?.otp_session_key ||        // direct
        response?.otp_session_key ||              // root
        response?.data?.data ||                   // string case
        response?.data;                           // raw fallback

      if (!sessionKey || typeof sessionKey !== "string") {
        throw new Error("Invalid OTP response structure");
      }

      /**
       * ✅ Store safely
       */
      localStorage.setItem("mobile_otp_session", sessionKey);

      /**
       * ✅ Move to next step
       */
      onNext({
        mobile,
        otpSessionKey: sessionKey,
      });

    } catch (err) {
      console.error("❌ SEND OTP ERROR:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send OTP. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Register</h1>

      <p className="cl-sub-para">
        Enter your mobile number to secure your LetsHyre account
      </p>

      <form className="cl-form" onSubmit={handleSendOtp}>
        
        {/* MOBILE INPUT */}
        <div className="cl-input-group">
          <input
            type="text"
            className="cl-input"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
              setError("");
            }}
            maxLength={10}
            required
          />
          <i className="bi bi-phone cl-icon"></i>
        </div>

        {/* ERROR */}
        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>
            {error}
          </p>
        )}

        {/* BUTTON */}
        <button className="cl-btn" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      {/* BACK BUTTON */}
      {onBack && (
        <p className="form-subtext">
          <a href="#" onClick={onBack}>Back</a>
        </p>
      )}
    </div>
  );
}

export default MobileVerify02;