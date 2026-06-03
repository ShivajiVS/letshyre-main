import React from "react";
import { useUnlockedCandidates } from "@/hooks/employer/useUnlockedCandidates";
import { UnlockedCandidateCard } from "./components/unlocked/UnlockedCandidateCard";
import { UnlockedCandidateSkeleton } from "./components/unlocked/UnlockedCandidateSkeleton";
import "./styles/unlocked-candidates-list.css";

export function UnlockedCandidatesList() {
  const { data: candidates, isLoading, error } = useUnlockedCandidates();

  return (
    <div className="uc-page-container">
      <div className="uc-header">
        <div className="uc-title-wrapper">
          <div className="uc-title-icon">
            <i className="bi bi-unlock-fill"></i>
          </div>
          <div>
            <h1 className="uc-title">Unlocked Candidates</h1>
            <p className="uc-subtitle">
              View and manage the candidate profiles you have unlocked.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="uc-error-state">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>
            {error.message || "Something went wrong while fetching unlocked candidates."}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="uc-grid">
          {/* Render 6 skeletons while loading */}
          {Array.from({ length: 6 }).map((_, i) => (
            <UnlockedCandidateSkeleton key={i} />
          ))}
        </div>
      ) : candidates?.length > 0 ? (
        <div className="uc-grid">
          {candidates.map((candidate) => (
            <UnlockedCandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        !error && (
          <div className="uc-empty">
            <div className="uc-empty-icon">
              <i className="bi bi-people"></i>
            </div>
            <h2 className="uc-empty-title">No candidates unlocked yet</h2>
            <p className="uc-empty-desc">
              When you unlock candidate profiles from the Candidate Pool, they will appear here for easy access.
            </p>
          </div>
        )
      )}
    </div>
  );
}
