/**
 * ProfileSkeleton.jsx
 * ---------------------
 * Shimmer-based skeleton screens that mirror the layout of EmployeeProfile2.
 * Import and render when `isLoading === true` from useCandidateProfile().
 */

// ─── Primitive Skeleton Block ────────────────────────────────────────────────
function Bone({ w = "100%", h = "14px", radius = "6px", mb = "0" }) {
  return (
    <div
      className="sk-bone"
      style={{ width: w, height: h, borderRadius: radius, marginBottom: mb }}
    />
  );
}

// ─── Hero Skeleton ────────────────────────────────────────────────────────────
export function HeroSkeleton() {
  return (
    <div className="sk-hero">
      <div className="sk-avatar" />
    </div>
  );
}

// ─── Personal Card Skeleton ───────────────────────────────────────────────────
export function PersonalCardSkeleton() {
  return (
    <div className="pp-personal-card sk-personal-card">
      {/* Avatar placeholder space */}
      <div style={{ height: "20px" }} />

      {/* Name + Role */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Bone w="160px" h="20px" radius="8px" mb="10px" />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Bone w="100px" h="14px" radius="6px" />
        </div>
      </div>

      {/* Section heading */}
      <Bone w="140px" h="18px" radius="6px" mb="18px" />

      {/* 3-column grid */}
      <div className="details-grid">
        {[0, 1, 2].map((col) => (
          <div key={col} className="grid-column">
            {[0, 1, 2].map((row) => (
              <div key={row} className="pp-item" style={{ marginBottom: "18px" }}>
                <Bone w="20px" h="20px" radius="50%" />
                <Bone w="80%" h="14px" radius="6px" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Generic Card Skeleton ────────────────────────────────────────────────────
export function CardSkeleton({ rows = 3, showTimeline = false }) {
  return (
    <div className="pp-card">
      <Bone w="140px" h="18px" radius="6px" mb="20px" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={showTimeline ? "pp-time-item" : "pp-edu"}
          style={{ marginBottom: "12px" }}
        >
          <Bone w="60%" h="14px" radius="6px" mb="8px" />
          <Bone w="80%" h="12px" radius="6px" mb="6px" />
          <Bone w="40%" h="12px" radius="6px" />
        </div>
      ))}
    </div>
  );
}

// ─── Score Card Skeleton ──────────────────────────────────────────────────────
export function ScoreCardSkeleton() {
  return (
    <div className="pp-card pp-score-card">
      <Bone w="180px" h="18px" radius="6px" mb="24px" style={{ margin: "0 auto 24px" }} />
      <div className="score-card-wrap">
        <div className="score-card-body" style={{ minHeight: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bone w="160px" h="160px" radius="50%" />
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Bone w="160px" h="44px" radius="12px" />
      </div>
    </div>
  );
}

// ─── Skills Skeleton ──────────────────────────────────────────────────────────
export function SkillsSkeleton() {
  return (
    <div className="pp-card">
      <Bone w="80px" h="18px" radius="6px" mb="16px" />
      <div className="pp-skills">
        {[100, 120, 90, 140, 80, 110].map((w, i) => (
          <Bone key={i} w={`${w}px`} h="34px" radius="8px" />
        ))}
      </div>
    </div>
  );
}
