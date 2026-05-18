import { useState } from "react";
import authService from "@/services/auth.service";

function RegisterEmail02({ onNext }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SEND EMAIL OTP ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !fullName || !email) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.sendRegisterEmailOtp({
        email,
        otp_type: "Registration",
      });

      console.log("OTP FULL RESPONSE:", response);

      /**
       * ✅ Handle ALL possible API structures
       */
      const otpSessionKey =
        response?.data?.data?.otp_session_key ||   // most likely
        response?.data?.otp_session_key ||         // fallback
        response?.otp_session_key ||               // fallback
        response?.data?.session_key;               // fallback

      if (!otpSessionKey) {
        throw new Error("OTP session key missing from API response");
      }

      /**
       * ✅ Store safely (prevents loss on refresh)
       */
      localStorage.setItem("email_otp_session", otpSessionKey);

      /**
       * ✅ Pass to next step
       */
      onNext({
        name: fullName,
        username,
        email,
        emailOtpSessionKey: otpSessionKey,
      });

    } catch (err) {
      console.error("OTP ERROR:", err);

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
      <h1 className="cl-title cl-title22">Register</h1>

      <p className="cl-sub-para">
        Build your dream team faster. Enter your work email.
      </p>

      <form className="cl-form register-form-align" onSubmit={handleSubmit}>
        
        {/* USERNAME */}
        <div className="cl-input-group">
          <input
            type="text"
            placeholder="Username"
            className="cl-input"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            required
          />
        </div>

        {/* FULL NAME */}
        <div className="cl-input-group">
          <input
            type="text"
            placeholder="Full Name"
            className="cl-input"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setError("");
            }}
            required
          />
        </div>

        {/* EMAIL */}
        <div className="cl-input-group">
          <input
            type="email"
            placeholder="Email"
            className="cl-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />
          <i className="bi bi-envelope cl-icon"></i>
        </div>

        {/* ERROR */}
        {error && (
          <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* BUTTON */}
        <button className="cl-btn" disabled={loading}>
          {loading ? "Sending OTP..." : "Verify"}
        </button>
      </form>

      {/* LOGIN LINK */}
      <p className="form-subtext">
        Already have an account? <br />
        <a href="sign-in">
          <span style={{ cursor: "pointer" }}>Back to Login</span>
        </a>
      </p>
    </div>
  );
}

export default RegisterEmail02;