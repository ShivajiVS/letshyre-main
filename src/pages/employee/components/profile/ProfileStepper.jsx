import React from "react";

function ProfileStepper({ step }) {
  const steps = [
    { number: 1, label: "Identity" },
    { number: 2, label: "Profile Photo" },
    { number: 3, label: "Job Preferences" },
    { number: 4, label: "Resume & Role" },
    { number: 5, label: "Review" },
  ];

  return (
    <div className="pc-stepper" data-step={step}>
      {steps.map((s, idx) => {
        const isCompleted = step > s.number;
        const isActive = step === s.number;

        let circleClass = "pc-step";
        if (isActive) circleClass += " active";
        if (isCompleted) circleClass += " completed";

        return (
          <div key={s.number} className={circleClass}>
            <div className="pc-circle">
              {isCompleted ? <i className="bi bi-check2"></i> : s.number}
            </div>
            <span className="pc-step-number">STEP {s.number}</span>
            <span className="pc-label-content">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ProfileStepper;
