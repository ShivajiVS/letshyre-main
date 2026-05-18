import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import img01 from "@/assets/login-img011.png";
import authService from "@/services/auth.service";

import "@pages/employee/auth/EmployeeSignIn.css";

export function EmployerSignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await authService.login({ email, password });

      console.log("LOGIN SUCCESS:", data);

      const redirectTo = location.state?.from?.pathname || "/employer";

      navigate(redirectTo, { replace: true });

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-page-main">
      <div className="candidate-page">

        {/* IMAGE */}
        <div className="candidate-img-part">
          <img className="candidate-mainImg" src={img01} alt="Login" />
        </div>

        {/* FORM */}
        <div className="form-part">
          <h1 className="cl-title">Login</h1>

          <form className="cl-form" onSubmit={handleLoginSubmit}>

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
              />
              <i className="bi bi-envelope cl-icon"></i>
            </div>

            {/* PASSWORD */}
            <div className="cl-input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="cl-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} cl-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {/* FORGOT */}
            <p className="cl-forget-link">
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate("/forgot-password", { state: { role: "employer" } })
                }
              >
                Forget Password?
              </span>
            </p>

            {/* ERROR */}
            {error && (
              <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <button className="cl-btn" disabled={loading}>
              {loading ? "Logging in..." : "LetsHyre Me"}
            </button>

          </form>

          {/* REGISTER */}
          <p className="form-subtext">
            Don’t have an account?
            <br />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/employer/register");
              }}
            >
              Register
            </a>
          </p>
        </div>

        <div className="cl-ball01"></div>
        <div className="cl-ball02"></div>

      </div>
    </div>
  );
}