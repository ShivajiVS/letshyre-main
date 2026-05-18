import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterSuccess02() {
  const navigate = useNavigate();

  /* ================= AUTO REDIRECT ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/employer/sign-in", { replace: true });
    }, 3000); // ⏱ 3 seconds (better UX)

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="register-success-wrapper">
      <div className="register-success-card">

        {/* CHECK ICON */}
        <div className="success-icon">✓</div>

        <h2 className="success-title">
          Your LetsHyre account was successfully created!
        </h2>

        <p className="success-subtitle">
          You’re all set. Login to post jobs and hire faster.
        </p>

        {/* BUTTON */}
        <button
          className="cl-btn success-btn"
          onClick={() => navigate("/employer/sign-in")}
        >
          Go to Login
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

export default RegisterSuccess02;