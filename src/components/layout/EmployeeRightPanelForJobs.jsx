import user_pic from "../../assets/user-pic.jpeg";

export default function EmployeeRightPanelForJobs({ profile }) {
  const userName = profile?.user?.first_name
    ? `${profile.user.first_name} ${profile.user.last_name || ""}`
    : profile?.user?.username || profile?.name || "User";

  const attempts =
    profile?.remaining_attempts ?? profile?.ai_attempts_remaining ?? 2;

  const handleTakeInterview = () => {
    // ✅ Get user from localStorage (reliable source)
    let storedUser = null;

    try {
      storedUser = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      console.error("Error parsing user", e);
    }

    const accessToken = storedUser?.access_token;
    const refreshToken = storedUser?.refresh_token;

    console.log("Stored User:", storedUser);

    // ✅ Validate access token
    if (!accessToken) {
      alert("Access token missing");
      return;
    }

    // ✅ Build EXACT deep link you want
    let deepLink = `letshyre://interview?ac=${encodeURIComponent(accessToken)}`;

    if (refreshToken) {
      deepLink += `&rc=${encodeURIComponent(refreshToken)}`;
    }

    console.log("Deep Link:", deepLink);

    // ✅ Open Electron / App
    window.location.href = deepLink;

    // ✅ Optional fallback
    setTimeout(() => {
      window.open("https://letshyre.com/download", "_blank");
    }, 2000);
  };

  return (
    <aside className="cd-right-panel">
      <h4>Take your AI Interview</h4>

      <div className="cd-profile-card">
        <img
          src={profile?.profile_photo || user_pic}
          alt="user"
          onError={(e) => {
            e.target.src = user_pic;
          }}
        />

        <h5>{userName}</h5>

        <p>
          You have {attempts} more attempts left to improve your results and
          boost your profile ranking.
        </p>

        <button className="cd-ai-btn" onClick={handleTakeInterview}>
          Take AI Interview
        </button>
      </div>
    </aside>
  );
}