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

    let deepLink = `letshyre://interview?ac=${encodeURIComponent(accessToken)}`;

    if (refreshToken) {
      deepLink += `&rc=${encodeURIComponent(refreshToken)}`;
    }

    console.log("Deep Link:", deepLink);

    const start = Date.now();

    // Create hidden iframe
    const iframe = document.createElement("iframe");

    iframe.style.display = "none";
    iframe.src = deepLink;

    document.body.appendChild(iframe);

    // Detect whether app opened
    setTimeout(() => {
      document.body.removeChild(iframe);

      // If browser still focused after delay,
      // assume app is not installed
      const elapsed = Date.now() - start;

      if (elapsed < 3500 && document.hasFocus()) {
        // window.location.href = "https://letshyre.com/download";
        window.location.href = "http://localhost:5173/download";
      }
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
