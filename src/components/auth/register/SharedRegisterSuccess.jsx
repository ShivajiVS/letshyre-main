import { useNavigate } from "react-router";

export function SharedRegisterSuccess({ role }) {
  const navigate = useNavigate();

  const handleFinish = () => {
    const loginRoute = role === "employer" ? "/employer/sign-in" : "/employee/sign-in";
    navigate(loginRoute, { replace: true });
  };

  return (
    <div className="register-success-wrapper">
      <div className="register-success-card">
        <div className="success-icon">
          <i className="bi bi-check-lg"></i>
        </div>
        
        <h2 className="success-title">
          {role === "employer" ? "Employer Account Created!" : "Employee Account Created!"}
        </h2>
        
        <p className="success-subtitle">
          Your LetsHyre account has been created successfully. You can now login.
        </p>

        <button className="cl-btn button01 success-btn" onClick={handleFinish}>
          Continue to Login
        </button>
      </div>
    </div>
  );
}
