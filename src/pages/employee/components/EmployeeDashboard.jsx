import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { createPortal } from "react-dom";

import { useAuth } from "../context/AuthContext";
import { menuItems } from "../config/menu";

import LockedOverlay from "@/components/dashboard/LockedOverlay";
import ProfileCompletion from "@/components/profile/ProfileCompletion";

import logo from "@/assets/logo2.png";
import logoutImg from "@/assets/logout.png";

const API_BASE = "https://api.letshyre.com";
const MEDIA_BASE = `${API_BASE}/media`;



export default function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, loadProfile } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);

  const [logoutModal, setLogoutModal] = useState(false);
  const [showProfileFlow, setShowProfileFlow] = useState(true);

  const [candidateProfile, setCandidateProfile] = useState(null);

  const activeTab = location.pathname.split("/")[2] || "find-jobs";

  /* ---------------------------
     FETCH CANDIDATE PROFILE
  ----------------------------*/

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");

        const token = user?.access_token || stored?.access_token;

        if (!token) return;

        const res = await fetch(`${API_BASE}/user/v1/candidate_profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          console.log("profile api failed");
          return;
        }

        const data = await res.json();

        const profile = data?.data || data;

        console.log("FINAL PROFILE:", profile);

        setCandidateProfile(profile);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingProfile(false); // ✅ IMPORTANT
      }
    };

    fetchProfile();
  }, [user]);

  /* ---------------------------
      IMAGE RESOLVER
  ----------------------------*/

  const profileImage = useMemo(() => {
    const sources = [
      candidateProfile?.profile_photo,
      candidateProfile?.profile_picture,

      candidateProfile?.candidate_profile?.profile_photo,
      candidateProfile?.candidate_profile?.profile_picture,

      candidateProfile?.user?.profile_photo,

      user?.candidate_profile?.profile_photo,
      user?.candidate_profile?.profile_picture,

      user?.profile_photo,
      user?.profile_picture,
      user?.photo,
      user?.image,
    ].filter(Boolean);

    let img = sources[0] || "";

    console.log("RAW IMAGE =", img);

    /* fallback avatar */
    if (!img) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user?.full_name || user?.name || "User",
      )}`;
    }

    /* full url */
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    /* /media/... */
    if (img.startsWith("/media/")) {
      return `${API_BASE}${img}`;
    }

    /* Candidate/Profile/... */
    img = img.replace(/^\/+/, "");

    return `${MEDIA_BASE}/${img}`;
  }, [user, candidateProfile]);

  const imageFallback = (e) => {
    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      user?.full_name || "User",
    )}`;
  };

  const completeProfile = async () => {
    await loadProfile();
    setShowProfileFlow(false);
  };

  if (loadingProfile || !candidateProfile) return null;

  return (
    <>
      <style>{`

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:Inter,sans-serif;
background:#eef5ff;
}

.cd-page{
min-height:100vh;
background:
linear-gradient(
135deg,
#eef5ff,
#f9fbff
);
}

.cd-dashboard{
display:flex;
min-height:100vh;
}

/* sidebar */

.cd-sidebar{
width:280px;
background:#fff;
padding:32px 24px;
box-shadow:
8px 0 30px rgba(0,0,0,.04);
}

.cd-logo{
text-align:center;
margin-bottom:45px;
}

.cd-logo img{
width:185px;
}

.cd-menu{
list-style:none;
}

.cd-menu li{
padding:16px 18px;
margin-bottom:14px;
border-radius:14px;
font-size:17px;
font-weight:600;
cursor:pointer;
transition:.25s;
color:#334155;
}

.cd-menu li:hover{
background:#edf4ff;
transform:translateX(5px);
}

.cd-menu li.active{
background:
linear-gradient(
135deg,
#6f9fff,
#4d7eff
);
color:#fff;
box-shadow:
0 8px 22px rgba(77,126,255,.28);
}

.logout{
margin-top:30px;
background:#fff4f4;
color:#dc2626;
}

/* main */

.cd-main{
flex:1;
padding:24px;
}

.cd-topbar{
background:#fff;
padding:18px 30px;
border-radius:24px;
display:flex;
justify-content:space-between;
align-items:center;
box-shadow:
0 8px 28px rgba(0,0,0,.04);
margin-bottom:24px;
}

.cd-topbar h2{
font-size:38px;
font-weight:800;
}

.cd-topbar h2 span{
color:#5c86ff;
}

/* profile badge */

.cd-user{
display:flex;
align-items:center;
gap:14px;
padding:8px 18px 8px 8px;
border-radius:60px;
background:
linear-gradient(
135deg,
#7da5ff,
#6f90eb
);
cursor:pointer;
box-shadow:
0 8px 22px rgba(77,126,255,.25);
}

.cd-user img{
width:54px;
height:54px;
border-radius:50%;
object-fit:cover;
border:4px solid #fff;
background:#fff;
}

.cd-user span{
color:#fff;
font-weight:700;
font-size:18px;
}

/* content */

.cd-content{
background:#fff;
padding:26px;
border-radius:26px;
box-shadow:
0 10px 35px rgba(0,0,0,.04);
}

/* interview panel */

.cd-right-panel{
margin-top:22px;
background:#fff;
padding:30px;
border-radius:26px;
box-shadow:
0 8px 28px rgba(0,0,0,.04);
}

.cd-right-panel h4{
text-align:center;
font-size:30px;
margin-bottom:25px;
}

.cd-profile-card{
text-align:center;
}

.cd-profile-card img{
width:150px;
height:150px;
border-radius:50%;
object-fit:cover;
border:5px solid #7ea2ff;
margin-bottom:18px;
}

.cd-profile-card h5{
font-size:28px;
margin-bottom:12px;
}

.cd-profile-card p{
font-size:18px;
line-height:1.6;
color:#666;
}

.cd-ai-btn{
margin-top:22px;
width:100%;
padding:15px;
border:none;
border-radius:14px;
font-size:18px;
font-weight:700;
cursor:pointer;
color:#fff;
background:
linear-gradient(
135deg,
#6f9dff,
#85acff
);
}

/* overlays */

.cd-overlay,
.logout-overlay{
position:fixed;
inset:0;
background:rgba(0,0,0,.55);
display:flex;
justify-content:center;
align-items:center;
z-index:9999;
}

.cd-popup-card{
width:min(1100px,95%);
background:#fff;
border-radius:30px;
padding:25px;
max-height:92vh;
overflow:auto;
}

/* logout */

.logout-modal{
background:#fff;
width:430px;
max-width:95%;
padding:35px;
border-radius:30px;
text-align:center;
}

.logout-modal img{
width:90px;
margin-bottom:15px;
}

.logout-modal h3{
font-size:30px;
margin-bottom:10px;
}

.logout-actions{
display:flex;
gap:14px;
margin-top:25px;
}

.logout-actions button{
flex:1;
padding:14px;
border:none;
border-radius:12px;
font-weight:700;
cursor:pointer;
}

.logout-actions button:first-child{
background:#edf4ff;
}

.logout-actions button:last-child{
background:#ef4444;
color:#fff;
}

@media(max-width:900px){

.cd-dashboard{
flex-direction:column;
}

.cd-sidebar{
width:100%;
}

.cd-main{
padding:16px;
}

.cd-topbar{
flex-direction:column;
gap:18px;
}

.cd-topbar h2{
font-size:28px;
}

.cd-user{
width:100%;
justify-content:center;
}

}

`}</style>

      <div className="cd-page">
        <div className="cd-dashboard">
          <aside className="cd-sidebar">
            <div className="cd-logo">
              <img src={logo} alt="logo" />
            </div>

            <ul className="cd-menu">
              {menuItems.map((item) => (
                <li
                  key={item.slug}
                  className={activeTab === item.slug ? "active" : ""}
                  onClick={() => navigate(item.route)}
                >
                  {item.name}
                </li>
              ))}

              <li className="logout" onClick={() => setLogoutModal(true)}>
                Logout
              </li>
            </ul>
          </aside>

          <main className="cd-main">
            <header className="cd-topbar">
              <h2>
                Explore <span>Jobs</span>
              </h2>

              <div
                className="cd-user"
                onClick={() => navigate("/employee/profile")}
              >
                <img src={profileImage} onError={imageFallback} alt="user" />

                <span>{user?.full_name || user?.name || "User"}</span>
              </div>
            </header>

            <section className="cd-content">
              <Outlet />
            </section>

            {activeTab === "find-jobs" && (
              <aside className="cd-right-panel">
                <h4>Take your AI Interview</h4>

                <div className="cd-profile-card">
                  <img src={profileImage} onError={imageFallback} alt="" />

                  <h5>{user?.full_name || user?.name}</h5>

                  <p>
                    You have {user?.interview_attempts_left || 2}
                    attempts left.
                  </p>

                  <button
                    className="cd-ai-btn"
                    onClick={() => navigate("/employee/interview")}
                  >
                    Take AI Interviewssdsddsdsdsd
                  </button>
                </div>
              </aside>
            )}
          </main>
        </div>

        {/*!candidateProfile.is_profile_complete && !showProfileFlow && (
          <LockedOverlay onAction={() => setShowProfileFlow(true)} />
        )*/}

        {showProfileFlow && (
          <div className="cd-overlay">
            <div className="cd-popup-card">
              <ProfileCompletion onComplete={completeProfile} />
            </div>
          </div>
        )}

        {logoutModal &&
          createPortal(
            <div
              className="logout-overlay"
              onClick={() => setLogoutModal(false)}
            >
              <div
                className="logout-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={logoutImg} alt="" />

                <h3>Oh no, you're leaving</h3>

                <p>Are you sure you want logout?</p>

                <div className="logout-actions">
                  <button onClick={() => setLogoutModal(false)}>Cancel</button>

                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    </>
  );
}
