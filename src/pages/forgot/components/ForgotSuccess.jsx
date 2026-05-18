import { useEffect } from "react";
import { useNavigate } from "react-router";

function ForgotSuccess({ role }) {
  const navigate = useNavigate();

  const redirectPath =
    role === "employer" ? "/employee-sign-in" : "/employer/sign-in";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectPath, { replace: true });
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
          className="cl-btn success-btn"
          onClick={() => navigate(redirectPath, { replace: true })}
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
