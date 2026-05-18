import { useState } from "react";

function StepRole({ onNext, onBack, profileData, setProfileData }) {
  const suggested = profileData.roles || [];

  const [selectedRole, setSelectedRole] = useState(profileData.role || "");

  const [customRole, setCustomRole] = useState("");

  const handleContinue = () => {
    const finalRole = selectedRole === "Other" ? customRole : selectedRole;

    if (!finalRole) return;

    setProfileData((prev) => ({
      ...prev,
      role: finalRole,
    }));

    onNext();
  };

  return (
    <>
      <style>{`

.role-card{
padding:25px;
background:#fff;
border-radius:24px;
box-shadow:0 8px 28px rgba(0,0,0,.05);
}

.role-title{
color:#4c84ff;
font-size:34px;
margin-bottom:24px;
}

.role-grid{
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(220px,1fr));
gap:18px;
margin-top:25px;
}

.role-option{
padding:18px;
border:2px solid #d8e5ff;
border-radius:18px;
cursor:pointer;
transition:.3s;
background:white;
font-weight:600;
text-align:center;
}

.role-option:hover{
transform:translateY(-3px);
}

.role-option.active{
background:#4c84ff;
color:#fff;
border-color:#4c84ff;
}

.custom-role-box{
margin-top:22px;
}

.custom-role-box input{
width:100%;
padding:15px;
border-radius:12px;
border:1px solid #ccc;
}

.role-actions{
margin-top:35px;
display:flex;
justify-content:space-between;
}

.btn-primary{
background:#4c84ff;
color:white;
border:none;
padding:14px 26px;
border-radius:12px;
font-weight:600;
}

`}</style>

      <div className="pc-step-content">
        <div className="role-card">
          <h3 className="role-title">Select Your Role</h3>

          <p>Choose one suggested role or add your own</p>

          <div className="role-grid">
            {suggested.map((role, i) => (
              <div
                key={i}
                onClick={() => setSelectedRole(role)}
                className={`role-option ${
                  selectedRole === role ? "active" : ""
                }`}
              >
                {role}
              </div>
            ))}

            <div
              onClick={() => setSelectedRole("Other")}
              className={`role-option ${
                selectedRole === "Other" ? "active" : ""
              }`}
            >
              + Other Role
            </div>
          </div>

          {selectedRole === "Other" && (
            <div className="custom-role-box">
              <input
                placeholder="Enter custom role"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
              />
            </div>
          )}

          <div className="role-actions">
            <button className="pc-back-btn" onClick={onBack}>
              Back
            </button>

            <button
              className="btn-primary"
              onClick={handleContinue}
              disabled={!selectedRole}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StepRole;
