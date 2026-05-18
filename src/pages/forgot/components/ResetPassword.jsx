import { useState } from "react";
import authService from "@/services/auth.service";

function ForgotResetPassword({ email, otpSessionKey, onNext }) {

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {

  e.preventDefault();

  if (password !== confirm) {
    setError("Passwords do not match");
    return;
  }

  try {

    setLoading(true);

    await authService.forgotPassword({
      email,
      otp_session_key: otpSessionKey,
      new_password: password,
      confirm_password: confirm
    });

    onNext();

  } catch (err) {

    setError(
      err?.response?.data?.message ||
      err?.message ||
      "Password reset failed"
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="register-box">

      <h1 className="cl-title">Set New Password</h1>

      <p className="cl-sub-para">
        Create a new secure password
      </p>

      <form className="cl-form" onSubmit={handleSubmit}>

        <div className="cl-input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="cl-input"
            placeholder="New password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <i
            className={`bi ${
              showPassword ? "bi-eye-slash" : "bi-eye"
            } cl-icon`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <div className="cl-input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="cl-input"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e)=>setConfirm(e.target.value)}
          />
        </div>

        {error && (
          <p style={{color:"red",fontSize:"14px"}}>{error}</p>
        )}

        <button className="cl-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>

    </div>
  );
}

export default ForgotResetPassword;