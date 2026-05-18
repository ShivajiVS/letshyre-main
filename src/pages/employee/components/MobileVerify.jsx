import { useState } from "react";
import authService from "@/services/auth.service";


function MobileVerify({ onNext, onBack }) {
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
        phone_number: mobile, // ✅ Only 10 digits
        otp_type: "Registration",
      });

      console.log("MOBILE OTP RESPONSE:", response.data);

      // ✅ CORRECT SESSION KEY EXTRACTION
      const sessionKey =
        response?.data?.data?.otp_session_key ||
        response?.data?.otp_session_key;

      if (!sessionKey) {
        throw new Error("Invalid OTP response structure");
      }

      onNext({
        mobile,
        otpSessionKey: sessionKey,
      });

    } catch (err) {
      console.error("SEND OTP ERROR:", err);

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

        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button className="cl-btn" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}

export default MobileVerify;
