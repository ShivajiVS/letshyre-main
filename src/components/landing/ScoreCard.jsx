import React, { useEffect, useRef } from "react";
import s_img01 from "@/assets/score01.png";
import s_img02 from "@/assets/score02.png";

import "./styles/score-card.css";

const stats = [
  { percentage: true, num: "98%", label: "Accuracy" },
  { num: "3x", label: "Faster" },
  { num: "50k+", label: "Matches" },
];

const bullets = [
  "Instant AI-driven skill matching",
  "Delivers only the most relevant talent",
  "Cuts through noise and finds true fit",
  "Helping you hire smarter and faster",
];

const progressBars = [
  { label: "Potential Score", value: 87 },
  { label: "Fit Score", value: 94 },
];

export function ScoreCard() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    cardsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sc-main" id="scorecards">
      {/* Background orbs */}
      <div className="sc-orb sc-orb--tr" aria-hidden="true" />
      <div className="sc-orb sc-orb--bl" aria-hidden="true" />

      {/* Header */}
      <div className="sc-header">
        <span className="sc-eyebrow">
          <span className="sc-eyebrow__dot" />
          AI Powered Platform
        </span>
        <h1 className="sc-title">
          AI Powered <span className="sc-title__accent">Scorecard</span> &amp;
          Matching
        </h1>
        <p className="sc-subtitle">
          Smart hiring decisions, powered by intelligence
        </p>
      </div>

      {/* Cards grid */}
      <div className="sc-grid">
        {/* ── LEFT CARD ── */}
        <div
          className="sc-card sc-card--left from-left"
          ref={(el) => (cardsRef.current[0] = el)}
        >
          <div className="sc-card__img-zone">
            <img src={s_img01} alt="Skill Matching illustration" />
          </div>
          <div className="sc-card__body">
            <span className="sc-tag">⚡ Feature</span>
            <h2 className="sc-card__heading">Skill Matching</h2>
            <ul className="sc-bullets">
              {bullets.map((b) => (
                <li key={b} className="sc-bullet">
                  {b}
                </li>
              ))}
            </ul>
            <div className="sc-stats">
              {stats.map((s) => (
                <div key={s.label} className="sc-stat">
                  {s.percentage === true ? (
                    <>
                      <span className="sc-stat__num sc-percentage">
                        {s.num}
                      </span>
                      <span className="sc-stat__label">{s.label}</span>
                    </>
                  ) : (
                    <>
                      <span className="sc-stat__num">{s.num}</span>
                      <span className="sc-stat__label">{s.label}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER CARD (two stacked mini-cards) ── */}
        <div
          className="sc-card sc-card--center from-center"
          ref={(el) => (cardsRef.current[1] = el)}
        >
          {/* Top mini */}
          <div className="sc-mini-card">
            <span className="sc-tag">🎯 Smart</span>
            <h2 className="sc-card__heading">Skill Matching</h2>
            <ul className="sc-bullets">
              <li className="sc-bullet">Instant AI-driven skill matching</li>
              <li className="sc-bullet">
                Delivers only the most relevant talent
              </li>
              <li className="sc-bullet">
                Cuts through noise and finds true fit
              </li>
            </ul>
          </div>

          {/* Bottom mini – Growth */}
          <div className="sc-mini-card sc-mini-card--growth">
            <div className="sc-icon-wrap">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a4fa0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <h2 className="sc-card__heading" style={{ fontSize: "1.15rem" }}>
              Growth Potential
            </h2>
            <p className="sc-card__text">
              Assess best employees. Predictive modelling for maximum growth.
            </p>
            {progressBars.map((bar) => (
              <div key={bar.label} className="sc-progress">
                <div className="sc-progress__label">
                  <span>{bar.label}</span>
                  <span className="sc-percentage">{bar.value}%</span>
                </div>
                <div className="sc-progress__track">
                  <div
                    className="sc-progress__fill"
                    style={{ "--fill-width": `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT CARD ── */}
        <div
          className="sc-card sc-card--right from-right"
          ref={(el) => (cardsRef.current[2] = el)}
        >
          <div className="sc-card__body">
            <span className="sc-tag">📊 Analytics</span>
            <h2 className="sc-card__heading">Performance Analytics</h2>
            <ul className="sc-bullets">
              <li className="sc-bullet">Instant AI-driven skill matching</li>
              <li className="sc-bullet">
                Delivers only the most relevant talent
              </li>
              <li className="sc-bullet">
                Cuts through noise and finds true fit
              </li>
              <li className="sc-bullet">Helping you hire smarter and faster</li>
            </ul>
            <div className="sc-stats">
              <div className="sc-stat">
                <span className="sc-stat__num">12k</span>
                <span className="sc-stat__label">Reports</span>
              </div>
              <div className="sc-stat">
                <span className="sc-stat__num sc-percentage">99%</span>
                <span className="sc-stat__label">Uptime</span>
              </div>
            </div>
          </div>
          <div className="sc-card__img-zone sc-card__img-zone--bottom">
            <img src={s_img02} alt="Performance Analytics illustration" />
          </div>
        </div>
      </div>
    </section>
  );
}
