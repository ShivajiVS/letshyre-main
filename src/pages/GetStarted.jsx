import candidateImg from "@/assets/get-start01.png";
import employerImg from "@/assets/get-start02.png";

import "./GetStarted.css";

import { useNavigate } from "react-router";

export function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="lh-direction-page">
      <div className="lh-direction-card">
        <div className="lh-text-part">
          <h1>Looking for your next great hire?</h1>

          <button
            className="button01 get-btn"
            onClick={() => navigate("/employer/sign-in")}
          >
            I'm Hiring →
          </button>
        </div>
        <div className="lh-img-part">
          <img src={employerImg} alt="" />
        </div>
      </div>

      <div className="lh-Candidat-card">
        <div className="lh-text-part">
          <h1>
            Ready to land your <br /> next job?
          </h1>
          <button
            className="button02 get-btn"
            onClick={() => navigate("/employee/sign-in")}
          >
            I’m Looking for a job →
          </button>
        </div>
        <div className="lh-img-part ">
          <img src={candidateImg} alt="" />
        </div>
      </div>
    </div>
  );
}
