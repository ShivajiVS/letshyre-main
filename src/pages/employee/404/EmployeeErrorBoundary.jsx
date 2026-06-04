import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import "../styles/EmployeeErrorBoundary.css";

export function EmployeeErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let config = {
    category: "System Error",
    title: "Session Interrupted",
    description:
      "We encountered an unexpected issue while loading your workspace. Our team has been notified.",
    code: "500",
    isFatal: false,
    actionLabel: "Re-sync Session",
  };

  if (isRouteErrorResponse(error)) {
    config.code = error.status;
    if (error.status === 404) {
      config.category = "404 Not Found";
      config.title = "Page Not Found";
      config.description =
        "The page you are looking for doesn't exist or has been moved.";
      config.actionLabel = "Back to Workspace";
    } else if (error.status === 401) {
      config.category = "401 Unauthorized";
      config.title = "Session Expired";
      config.description =
        "For your security, your session requires re-authentication. Please log in again.";
      config.actionLabel = "Re-authenticate";
    }
  } else if (error instanceof Error) {
    config.isFatal = true;
    config.title = "Rendering error";
    config.description =
      "A technical exception occurred. Our engineers have been alerted.";
    config.debug = error.message;
  }

  return (
    <div className="employee-error-container">
      <main className="employee-error-content">
        <div className="employee-error-mesh-bg"></div>
        
        <div className="employee-error-card">
          <div className="employee-error-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="employee-error-badge">
            <span className="employee-error-badge-dot"></span>
            {config.category}
          </div>

          <h1 className="employee-error-title">
            <span className="employee-text-gradient">{config.title}</span>
          </h1>
          <p className="employee-error-description">{config.description}</p>

          <div className="employee-error-actions">
            <button
              onClick={() => navigate(0)}
              className="employee-error-btn-primary"
            >
              {config.actionLabel}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="employee-error-btn-secondary"
            >
              Go Back
            </button>
          </div>

          {config.isFatal && config.debug && (
            <div className="employee-error-trace">
              Error: {config.debug}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
