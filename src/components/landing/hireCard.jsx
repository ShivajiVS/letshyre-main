import { useNavigate } from "react-router";

import hire01 from "@/assets/hire-img01.png";

import "./styles/hire-card.css";

export function HireCard() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hire-card-section">
        <div className="hire-card-main">
          <div className="hire-card-content">
            <h2>You Hire or Get Hired?</h2>
            <p>
              Empower your hiring or job search with AI, connecting you faster
              and smarter than ever before. Revolutionize your recruitment
              journey, backed by cutting-edge intelligence
            </p>
            <div className="buttons-section02">
              <button
                className="job-button02"
                onClick={() => navigate("/employer/sign-in")}
              >
                Start Hiring →
              </button>
              <button
                className="hiring-button02"
                onClick={() => navigate("/employee/sign-in")}
              >
                Apply for Job →
              </button>
            </div>
          </div>
          <div className="hire-card-img-part">
            <img className="hire-img" src={hire01} alt="Hire" />
          </div>
          <div className="hire-card-inner01"></div>
          <div className="hire-card-inner02"></div>
          <div className="hire-card-inner03"></div>
          <div className="hire-card-inner04"></div>
        </div>
      </section>
    </>
  );
}
