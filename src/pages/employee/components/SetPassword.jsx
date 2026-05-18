import { useState } from "react";
import authService from "@/services/auth.service";

function SetPassword({ registerData, onNext }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await authService.finalRegister({
        name: registerData.name, // ⭐ KEY FIX
        username: registerData.username,
        email: registerData.email,
        phone_number: registerData.phone_number,
        role: "Candidate",
        password,
        confirm_password: confirmPassword,
      });

      onNext(); // success screen
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Set Password</h1>

      <p className="cl-sub-para">Create a secure password for your account</p>

      <form className="cl-form" onSubmit={handleSubmit}>
        <div className="cl-input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="cl-input"
            placeholder="Set Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />
          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} cl-icon`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <div className="cl-input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="cl-input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            required
          />
        </div>

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

        <button className="cl-btn" disabled={loading}>
          {loading ? "Registering..." : "Verify"}
        </button>
      </form>
    </div>
  );
}

export default SetPassword;
