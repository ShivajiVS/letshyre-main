import { useState } from "react";
import "./registerFlow.css";
import { sendEmailOtp } from "@/services/register.service";
import authService from "@/services/auth.service";
import { Link } from "react-router";

function RegisterEmail({ onNext }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    email: "",
    emailOtpSessionKey: "",
    fullMobileNumber: "",
    mobileOtpSessionKey: "",
  });

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

      // 1️⃣ Send OTP API
      const response = await authService.sendRegisterEmailOtp({
        email,
        otp_type: "Registration",
      });

      const otpSessionKey = response?.data?.otp_session_key;

      if (!otpSessionKey) {
        throw new Error("OTP session key missing");
      }

      // 2️⃣ Pass data to RegisterFlow
      onNext({
        name: fullName, // ⭐ IMPORTANT FIX
        username,
        email,
        emailOtpSessionKey: response.data.otp_session_key,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="register-box">
        <h1 className="cl-title cl-title22">Register</h1>

        <p className="cl-sub-para">Create your LetsHyre account</p>

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

          {error && (
            <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button className="cl-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="form-subtext">
          Already have an account? <br />
          <Link to="/get-started">
            <span style={{ cursor: "pointer" }}>Back to Login</span>
          </Link>
        </p>
      </div>
    </>
  );
}

export default RegisterEmail;
