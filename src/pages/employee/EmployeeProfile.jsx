import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import {
  HeroSkeleton,
  PersonalCardSkeleton,
  CardSkeleton,
  ScoreCardSkeleton,
  SkillsSkeleton,
} from "./ProfileSkeleton";

import "./styles/employee-profile.css";

const CX = 120,
  CY = 128,
  R = 90,
  STROKE = 28,
  GAP_DEG = 8;

const parseField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Computes a human-readable notice period from the last working day.
 * Returns "Immediate Joiner" when the date is today or in the past.
 */
const getNoticePeriod = (lastDate) => {
  if (!lastDate) return "Not specified";
  const diff = Math.ceil(
    (new Date(lastDate) - new Date()) / (1000 * 60 * 60 * 24),
  );
  return diff <= 0 ? "Immediate Joiner" : `${diff} days`;
};

/** Formats a raw number (e.g. 600000) into ₹ 6,00,000 using Indian locale. */
const formatCTC = (value) => {
  if (!value && value !== 0) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

function polar(deg) {
  const rad = (deg * Math.PI) / 180;
  return [CX + R * Math.cos(rad), CY - R * Math.sin(rad)];
}

function arcD(startDeg, endDeg) {
  if (Math.abs(startDeg - endDeg) < 0.5) return "";
  const [x1, y1] = polar(startDeg);
  const [x2, y2] = polar(endDeg);
  const large = startDeg - endDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function GaugeSVG({ score }) {
  const scoreDeg = (score / 100) * 180;
  const half = GAP_DEG / 2;
  const leftEnd = Math.max(180 - scoreDeg + half, 0.5);
  const rightStart = Math.min(180 - scoreDeg - half, 179.5);
  const dLeft = score > 0 ? arcD(180, leftEnd) : "";
  const dRight = score < 100 && rightStart > 1 ? arcD(rightStart, 0) : "";

  return (
    <svg
      viewBox="0 20 240 120"
      className="gauge-svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <defs>
        <filter id="glassmorphism" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="-2"
            dy="-2"
            stdDeviation="3"
            floodColor="#ffffff"
            floodOpacity="1"
          />
          <feDropShadow
            dx="3"
            dy="3"
            stdDeviation="4"
            floodColor="#90b2e8"
            floodOpacity="0.5"
          />
        </filter>
      </defs>
      {dRight && (
        <path
          d={dRight}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          filter="url(#glassmorphism)"
        />
      )}
      {dLeft && (
        <path
          d={dLeft}
          fill="none"
          stroke="#ffffff"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/** A single entry in the work experience timeline. */
function ExperienceItem({ role, company, duration, description }) {
  return (
    <div className="pp-time-item">
      <h5>{role}</h5>
      <p className="pp-grey-text">{company}</p>
      <p className="pp-grey-text">{duration}</p>
      {description && <p className="pp-project-desc">{description}</p>}
    </div>
  );
}

/** A single education block. */
function EducationItem({ degree, institution, duration }) {
  return (
    <div className="pp-edu">
      <h5>{institution}</h5>
      <p className="pp-grey-text">{degree}</p>
      <p className="pp-grey-text">{duration}</p>
    </div>
  );
}

/** A single project block. */
function ProjectItem({ title, description, technologies }) {
  return (
    <div className="pp-edu">
      <h5>{title || "Untitled Project"}</h5>
      {description && <p className="pp-project-desc">{description}</p>}
      {Array.isArray(technologies) && technologies.length > 0 && (
        <p
          className="pp-grey-text"
          style={{ fontSize: "0.85rem", marginTop: "12px" }}
        >
          {technologies.join(", ")}
        </p>
      )}
    </div>
  );
}

/** Document download / view link. */
function DocLink({ href, label, icon = "bi-file-earmark-text" }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pp-doc-link"
    >
      <i className={`bi ${icon}`} />
      {label}
    </a>
  );
}

function EmptyState({ message = "No data available." }) {
  return <div className="ep-empty">{message}</div>;
}

function ScoreCard({ score, interviewAttempts, maxInterviews }) {
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let current = 0;
    const target = score ?? 0;
    const step = () => {
      current = Math.min(current + 1.5, target);
      setDisplayScore(Math.round(current));
      if (current < target) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  return (
    <div className="pp-card pp-score-card">
      <h4
        className="pp-heading"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Profile Completion
      </h4>

      <div className="score-card-wrap">
        <div className="score-card-shadow" />
        <div className="score-card-body">
          <div className="gauge-area">
            <GaugeSVG score={displayScore} />
            <div className="gauge-text-block">
              <div className="gauge-pct">{displayScore}%</div>
              <div className="gauge-sub">
                {interviewAttempts ?? 0} of {maxInterviews ?? 3} Interviews Used
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gauge-details-btn-container">
        <Link to="/employer/employee-score-card" className="gauge-details-btn">
          Check Full Details
        </Link>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="ep-error-banner">
      <i className="bi bi-wifi-off" />
      <p>Could not load your profile. Please check your connection.</p>
      <button className="ep-retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <PersonalCardSkeleton />
      <div className="pp-main-grid">
        <div className="pp-left">
          <CardSkeleton rows={4} showTimeline />
          <CardSkeleton rows={2} />
          <CardSkeleton rows={2} />
        </div>
        <div className="pp-right">
          <ScoreCardSkeleton />
          <SkillsSkeleton />
          <CardSkeleton rows={2} />
        </div>
      </div>
    </>
  );
}

export function EmployeeProfile() {
  const { data: raw, isLoading, isError, refetch } = useCandidateProfile();

  /* Safely unwrap array fields in case the API returns JSON strings */
  const profile = raw
    ? {
        ...raw,
        education: parseField(raw.education),
        experience: parseField(raw.experience),
        projects: parseField(raw.projects),
        skills: parseField(raw.skills),
        certifications: parseField(raw.certifications),
        preferred_locations: parseField(raw.preferred_locations),
      }
    : null;

  if (isLoading) {
    return (
      <div className="pp-wrapper">
        <ProfileLoadingSkeleton />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="pp-wrapper">
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const noticePeriod = getNoticePeriod(profile.last_day_of_working);
  const hasDocuments =
    profile.resume ||
    profile.experience_letter ||
    profile.resignation_letter ||
    profile.present_offer;

  return (
    <div className="pp-wrapper">
      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="pp-hero">
        <div className="pp-hero-bg-text">LETSHYRE</div>
        <Link to={-1} className="go-back-btn">
          <i className="bi bi-arrow-left" />
          <span className="go-back">Go Back</span>
        </Link>
      </div>

      {/* ── PERSONAL CARD ─────────────────────────────────── */}
      <div className="pp-personal-card">
        {/* Avatar */}
        <div className="pp-avatar-block">
          <div className="pp-avatar-wrapper">
            <img
              src={
                profile.profile_photo ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(profile.name || "User") +
                  "&background=a8c8f9&color=fff&size=170"
              }
              className="pp-avatar"
              alt={profile.name || "User Avatar"}
              onError={(e) => {
                e.currentTarget.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(profile.name || "User") +
                  "&background=a8c8f9&color=fff&size=170";
              }}
            />
            <div className="pp-avatar-overlay" />
            <div className="pp-avatar-info">
              {/* <h3 className="pp-avatar-name">{profile.name || "—"}</h3> */}
              {/* <p className="pp-avatar-role">
                {profile.role || profile.preferred_industry || "—"}
              </p> */}
            </div>
          </div>
        </div>

        <h4 className="pp-heading" style={{ marginTop: "10px" }}>
          Personal Details
        </h4>

        <div className="personal-details-container">
          <div className="details-grid">
            {/* Column 1 — Contact */}
            <div className="grid-column">
              <div className="pp-item">
                <i className="bi bi-envelope" />
                <p
                  className="pp-grey-text"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {profile.email || "N/A"}
                </p>
              </div>
              <div className="pp-item">
                <i className="bi bi-telephone" />
                <p className="pp-grey-text">
                  {profile.phone_number ? `+91 ${profile.phone_number}` : "N/A"}
                </p>
              </div>
              <div className="pp-item">
                <i className="bi bi-geo-alt" />
                <p className="pp-grey-text">
                  {profile.location || profile.address || "N/A"}
                </p>
              </div>
            </div>

            {/* Column 2 — Demographics */}
            <div className="grid-column center-column">
              <div className="pp-item">
                <i className="bi bi-person" />
                <p className="pp-grey-text">{profile.gender || "N/A"}</p>
              </div>
              {profile.present_or_last_working_company && (
                <div className="pp-item">
                  <i className="bi bi-building" />
                  <p className="pp-grey-text">
                    {profile.present_or_last_working_company}
                  </p>
                </div>
              )}
              <div className="pp-item">
                <i className="bi bi-briefcase" />
                <p className="pp-grey-text">
                  {profile.total_experience_years
                    ? `${profile.total_experience_years} yrs exp.`
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Column 3 — Status + Interview Progress */}
            <div className="grid-column right-column">
              {/* <div className="pp-item">
                <i className="bi bi-award" />
                <div className="score-container">
                  <p className="pp-grey-text">Profile Completion</p>
                  <div className="progress-wrapper">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${profile.profile_completion_score ?? 0}%`,
                        }}
                      />
                    </div>
                    <span className="progress-badge">
                      {profile.profile_completion_score ?? 0}%
                    </span>
                  </div>
                </div>
              </div> */}
              {/* <div className="pp-item">
                <i
                  className={`bi ${profile.is_verified ? "bi-patch-check-fill" : "bi-patch-check"}`}
                  style={{ color: profile.is_verified ? "#22c55e" : undefined }}
                />
                <p className="pp-grey-text">
                  {profile.is_verified ? "Verified" : "Not Verified"}
                </p>
              </div> */}
              <div className="pp-item">
                <i className="bi bi-camera-video" />
                <p className="pp-grey-text">
                  {profile.interview_attempts_used ?? 0}/
                  {profile.max_interviews_allowed ?? 3} Interviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────── */}
      <div className="pp-main-grid">
        {/* ── LEFT COLUMN ─────────────────────────────────── */}
        <div className="pp-left">
          {/* Work Experience */}
          <div className="pp-card">
            <h4 className="pp-heading Experence-text">Work Experience</h4>
            {profile.experience.length === 0 ? (
              <EmptyState message="No work experience added yet." />
            ) : (
              <div className="pp-timeline">
                {profile.experience.map((exp, i) => (
                  <ExperienceItem key={i} {...exp} />
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="pp-card">
            <h4 className="pp-heading">Education</h4>
            {profile.education.length === 0 ? (
              <EmptyState message="No education details added yet." />
            ) : (
              profile.education.map((edu, i) => (
                <EducationItem key={i} {...edu} />
              ))
            )}
          </div>

          {/* Projects */}
          <div className="pp-card">
            <h4 className="pp-heading">Projects</h4>
            {profile.projects.length === 0 ? (
              <EmptyState message="No projects added yet." />
            ) : (
              profile.projects.map((proj, i) => (
                <ProjectItem key={i} {...proj} />
              ))
            )}
          </div>

          {/* Certifications */}
          {profile.certifications.length > 0 && (
            <div className="pp-card">
              <h4 className="pp-heading">Certifications</h4>
              {profile.certifications.map((cert, i) => (
                <div key={i} className="pp-edu">
                  <p className="pp-grey-text" style={{ margin: 0 }}>
                    {cert}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────── */}
        <div className="pp-right">
          {/* Profile Completion Gauge */}
          <ScoreCard
            score={profile.profile_completion_score ?? 0}
            interviewAttempts={profile.interview_attempts_used}
            maxInterviews={profile.max_interviews_allowed}
          />

          {/* Skills */}
          <div className="pp-card">
            <h4 className="pp-heading">Skills</h4>
            {profile.skills.length === 0 ? (
              <EmptyState message="No skills added yet." />
            ) : (
              <div className="pp-skills">
                {profile.skills.map((skill, i) => (
                  <span key={i}>{skill}</span>
                ))}
              </div>
            )}
          </div>

          {/* CTC */}
          <div className="pp-card">
            <h4 className="pp-heading">CTC &amp; Salary Expectations</h4>
            <div className="pp-edu">
              <h5>Current CTC</h5>
              <p className="pp-grey-text">{formatCTC(profile.current_ctc)}</p>
              <h5>Expected CTC</h5>
              <p className="pp-grey-text">{formatCTC(profile.expected_ctc)}</p>
            </div>
          </div>

          {/* Notice Period */}
          <div className="pp-card">
            <h4 className="pp-heading">Notice Period</h4>
            <div className="pp-edu">
              <h5>Availability</h5>
              <p className="pp-grey-text">{noticePeriod}</p>
              {profile.last_day_of_working && (
                <>
                  <h5>Last Working Day</h5>
                  <p className="pp-grey-text">{profile.last_day_of_working}</p>
                </>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="pp-card">
            <h4 className="pp-heading">Documents</h4>
            {!hasDocuments ? (
              <EmptyState message="No documents uploaded yet." />
            ) : (
              <div className="pp-docs-list">
                <DocLink
                  href={profile.resume}
                  label="Resume"
                  icon="bi-file-earmark-person"
                />
                <DocLink
                  href={profile.experience_letter}
                  label="Experience Letter"
                  icon="bi-file-earmark-text"
                />
                <DocLink
                  href={profile.resignation_letter}
                  label="Resignation Letter"
                  icon="bi-file-earmark-break"
                />
                <DocLink
                  href={profile.present_offer}
                  label="Present Offer Letter"
                  icon="bi-file-earmark-check"
                />
              </div>
            )}
          </div>

          {/* Address */}
          {profile.address && (
            <div className="pp-card">
              <h4 className="pp-heading">Address</h4>
              <div className="pp-edu">
                <p className="pp-grey-text">{profile.address}</p>
              </div>
            </div>
          )}

          {/* Preferences */}
          <div className="pp-card">
            <h4 className="pp-heading">Preferences</h4>
            <div className="pp-edu">
              {profile.role && (
                <>
                  <h5>Desired Role</h5>
                  <p className="pp-grey-text">{profile.role}</p>
                </>
              )}
              {profile.preferred_locations?.length > 0 && (
                <>
                  <h5>Preferred Locations</h5>
                  <p className="pp-grey-text">
                    {profile.preferred_locations.join(", ")}
                  </p>
                </>
              )}
              {profile.preferred_industry && (
                <>
                  <h5>Preferred Industry</h5>
                  <p className="pp-grey-text">{profile.preferred_industry}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
