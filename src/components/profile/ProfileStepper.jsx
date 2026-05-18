import React from "react";
import "./ProfileCompletion.css";

function ProfileStepper({ step, onStepClick = null }) {
  const steps = [
    {
      id: 1,
      label: "Identity Verification",
      icon: "bi-person-lines-fill",
      short: "Identity",
    },

    {
      id: 2,
      label: "Job Preferences",
      icon: "bi-briefcase",
      short: "Job",
    },

    {
      id: 3,
      label: "Resume & Roles",
      icon: "bi-file-earmark-text",
      short: "Resume",
    },

    {
      id: 4,
      label: "Review & Confirm",
      icon: "bi-person-check",
      short: "Review",
    },
  ];

  return (
    <div className="pc-stepper-wrapper">
      <div className="pc-stepper">
        {steps.map((item, index) => {
          const current = index + 1;

          const isCompleted = step > current;
          const isActive = step === current;
          const isPending = step < current;

          return (
            <React.Fragment key={item.id}>
              {/* connector line */}
              {index !== 0 && (
                <div
                  className={`
                    pc-line
                    ${isCompleted || isActive ? "active-line" : ""}
                  `}
                />
              )}

              <div
                className={`
                  pc-step
                  ${isActive ? "active" : ""}
                  ${isCompleted ? " completed" : ""}
                  ${isPending ? " pending" : ""}
                `}
                onClick={() => {
                  if (onStepClick && current <= step) {
                    onStepClick(current);
                  }
                }}
              >
                {/* circle */}
                <div className="pc-circle">
                  {isCompleted ? (
                    <i className="bi bi-check2"></i>
                  ) : (
                    <i className={`bi ${item.icon}`}></i>
                  )}
                </div>

                {/* text */}

                <div className="pc-step-text">
                  <div className="pc-step-number">Step {current}</div>

                  <div className="pc-label-content">{item.label}</div>

                  {/* mobile short */}
                  <div className="pc-label-mobile">{item.short}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* optional progress bar */}
      <div className="pc-progress-wrap">
        <div className="pc-progress-track">
          <div
            className="pc-progress-fill"
            style={{
              width: `${((step - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileStepper;
