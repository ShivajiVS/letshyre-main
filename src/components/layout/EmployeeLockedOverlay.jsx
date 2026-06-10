import "./styles/employee-locked-overlay.css";
import overlay_img from "@/assets/unlock-img.png";

function EmployeeLockedOverlay({ onAction }) {
  return (
    <div className="locked-overlay">
      <div className="locked-card">
        <div className="locked-img">
          <img src={overlay_img} alt="" />
        </div>
        <div className="locked-content">
          <h3> Unlock Full Access!</h3>
          <p>Complete your profile to access all features</p>
          <button className="locked-btn" onClick={onAction}>
            Go to Profile<i className="bi bi-arrow-right-short"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLockedOverlay;
