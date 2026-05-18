import React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import heroImg from "@/assets/hero1.jpeg";
import first_part_bg from "@/assets/FP_bg.png";
import bell_icon from "@/assets/Bell-Icon.png";
import robo01 from "@/assets/Robo01.png";
import group from "@/assets/group02.png";

import "./hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const startRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          obs.unobserve(entry.target); // run only once
        }
      },
      { threshold: 0.6 },
    );

    if (startRef.current) observer.observe(startRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="Hero-section" id="home">
        <div className="hero-text-part">
          <span className="blue-text">
            AI Hiring Platform for Notice-Period Talent
          </span>
          <p className="grey-text">
            Letshyre automates resume evaluation, AI interviews, and candidate
            verification for modern HR teams
          </p>
          <div className="buttons-section">
            <button className="job-button button01">I'm Hiring →</button>
            <button
              className="hiring-button button02"
              onClick={() => navigate("/get-started")}
            >
              I’m Looking for a job →{" "}
            </button>
          </div>
          <div className="percetage-box">
            <div className="percetage-box-inner01">
              <span>100%</span>
              <p>AI-Verified</p>
            </div>
            <div className="percetage-box-inner02">
              <p className="grey-text">Increase your Hiring by</p>
              <span>40%</span>
              <a href="">See the categories→</a>
            </div>
          </div>
        </div>
        <div className="hero-image-part">
          <img src={heroImg} alt="main-img" />
          <div className="robo-box">
            <img src={robo01} alt="Robo" />
          </div>
          <div className="Users-box">
            <p className="notifictaion-text">5k+ Got Hired Already </p>
            <img src={group} alt="users-img" />
          </div>
          <div className="notification-box">
            <p className="notifictaion-text">
              <img src={bell_icon} alt="" />
              Job Notification
            </p>
          </div>
        </div>
        <div className="FP-triangle">
          <img className="first_part_bg" src={first_part_bg} alt="" />
        </div>
      </div>

      <div className="tagline-wrapper">
        <div className="tagline">
          <div className="tag-right-lines">
            <span className="tag-line01">Stop Screening</span>
            <span className="tag-line02 scroll-start" ref={startRef}>
              Start Shortlisting
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
