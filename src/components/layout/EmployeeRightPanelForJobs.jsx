import { useNavigate } from "react-router";

export default function EmployeeRightPanelForJobs({ profile }) {
  const userName = profile?.name;
  const navigate = useNavigate();

  const handleTakeInterview = () => {
    // Simply route the user to your dedicated, public launch page
    navigate("/employee/interview/launch");
  };

  return (
    <aside className="cd-right-panel">
      <h4>Take your AI Interview</h4>
      <div className="cd-profile-card">
        <img src={profile?.profile_photo} alt="Your Profile" />
        <h5>{userName}</h5>
        <p>
          You have {profile?.interview_attempts_remaining || 0} more attempts
          left.
        </p>

        <button
          className="cd-ai-btn"
          onClick={handleTakeInterview}
          disabled={!profile?.interview_attempts_remaining}
        >
          {profile?.interview_attempts_remaining > 0
            ? "Take AI Interview"
            : "No attempts remaining"}
        </button>
      </div>
    </aside>
  );
}
