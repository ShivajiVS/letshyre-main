import { useRouteError, isRouteErrorResponse, useNavigate, Link } from "react-router";
import logo from "@/assets/logo2.png";
import "../styles/EmployerErrorBoundary.css";

export function EmployerErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let config = {
    category: "System Error",
    title: "Something went wrong",
    description:
      "We encountered an unexpected issue while loading this page. Our team has been notified.",
    code: "500",
    isFatal: false,
    actionLabel: "Try Again",
  };

  if (isRouteErrorResponse(error)) {
    config.code = error.status;
    if (error.status === 404) {
      config.category = "404 Not Found";
      config.title = "Page Not Found";
      config.description =
        "The page you are looking for doesn't exist or has been moved.";
      config.actionLabel = "Back to Dashboard";
    } else if (error.status === 401) {
      config.category = "401 Unauthorized";
      config.title = "Session Expired";
      config.description =
        "Your session has expired. Please log in again to continue.";
      config.actionLabel = "Log In";
    }
  } else if (error instanceof Error) {
    config.isFatal = true;
    config.title = "Application Error";
    config.description =
      "A technical exception occurred. Please try refreshing the page or contact support if the issue persists.";
    config.debug = error.message;
  }

  return (
    <div className="employer-error-container">
      {/* Optional Top Header with Logo like the website */}
      <header className="employer-error-header">
        <Link to="/">
          <img src={logo} alt="Letshyre Logo" className="employer-error-logo" />
        </Link>
      </header>

      <main className="employer-error-content">
        <div className="employer-error-glow"></div>
        
        <div className="employer-error-card">
          <div className="employer-error-badge">
            <span className="employer-error-badge-dot"></span>
            {config.category}
          </div>

          <h1 className="employer-error-title">
            <span className="employer-text-gradient">{config.title}</span>
          </h1>
          <p className="employer-error-description">{config.description}</p>

          <div className="employer-error-actions">
            <button
              onClick={() => navigate(0)}
              className="employer-error-btn-primary"
            >
              {config.actionLabel}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="employer-error-btn-secondary"
            >
              Go Back
            </button>
          </div>

          {config.isFatal && config.debug && (
            <div className="employer-error-trace">
              Error: {config.debug}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
