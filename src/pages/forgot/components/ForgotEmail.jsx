import { useState } from "react";
import authService from "@/services/auth.service";
import { Link } from "react-router";

import "@/pages/employee/auth/EmployeeSignIn";

function ForgotEmail({ onNext, onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.sendRegisterEmailOtp({
        email,
        otp_type: "Forgot Password",
      });

      const otpSessionKey = response?.otp_session_key;

      if (!otpSessionKey) {
        throw new Error("OTP session key missing");
      }

      onNext({
        email,
        otpSessionKey,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to send OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Forgot Password?</h1>

      <p className="cl-sub-para">
        No worries - we’ll send you an OTP to reset your password
      </p>

      <form className="cl-form" onSubmit={handleSubmit}>
        <div className="cl-input-group">
          <input
            type="email"
            className="cl-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          <i className="bi bi-envelope cl-icon"></i>
        </div>

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

        <button className="cl-btn button01" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      <p className="form-subtext">
        <Link to="/get-started" onClick={onBack}>
          Back to Login
        </Link>
      </p>
    </div>
  );
}

export default ForgotEmail;
