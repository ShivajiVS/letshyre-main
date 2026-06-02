import { useEffect } from "react";
import { useNavigate } from "react-router";

function ForgotSuccess({ role }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/get-started", { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="register-success-wrapper">
      <div className="register-success-card">
        <div className="success-icon">✓</div>

        <h2 className="success-title">Password Reset Successful</h2>

        <p className="success-subtitle">Redirecting to login...</p>

        <button
          className="cl-btn button01"
          onClick={() => navigate("/get-started", { replace: true })}
          style={{ marginTop: "2rem", padding: "18px 40px", fontSize: "16px" }}
        >
          Back to Login
        </button>
      </div>

      {/* CONFETTI */}
      <div className="confetti confetti-1"></div>
      <div className="confetti confetti-2"></div>
      <div className="confetti confetti-3"></div>
      <div className="confetti confetti-1"></div>
      <div className="confetti confetti-2"></div>
      <div className="confetti confetti-1"></div>
    </div>
  );
}

export default ForgotSuccess;
