import { useEffect } from "react";
import { useNavigate } from "react-router";

function RegisterSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional auto-focus or analytics later
    console.log("Registration completed successfully");
  }, []);

  /* ================= AUTO REDIRECT ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/get-started", { replace: true });
    }, 5000);

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
          You’re all set. Login to explore jobs and opportunities.
        </p>

        <button
          className="cl-btn button01"
          onClick={() => navigate("/get-started")}
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

export default RegisterSuccess;
