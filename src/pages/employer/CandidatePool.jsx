import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import {
  useOpenJobs,
  useAIMatchedCandidates,
  useUnlockCandidateProfile,
} from "@/hooks/employer/useCandidatePool";
import { showSuccess, showError } from "@/utils/toast";
import { JobSelector } from "./components/candidate-pool/JobSelector";
import { CandidateCard } from "./components/candidate-pool/CandidateCard";
import { CandidatePoolSkeleton } from "./components/candidate-pool/CandidatePoolSkeleton";
import { EmptyState } from "./components/candidate-pool/EmptyState";
import UnlockProfileModal from "@/pages/employer/components/candidate-pool/UnlockProfileModal";

import "@/pages/employer/styles/candidate-pool.css";

export function CandidatePool() {
  const navigate = useNavigate();

  // ================= STATE =================
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobPage, setJobPage] = useState(1);
  const [candidateToUnlock, setCandidateToUnlock] = useState(null);
  const [candidateFilter, setCandidateFilter] = useState("ai_matched");

  // Derive whether to pass applied_only query param
  const appliedOnly = candidateFilter === "applied";

  // ================= QUERIES =================
  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsError,
    refetch: refetchJobs,
  } = useOpenJobs(jobPage);

  const {
    data: candidatesData,
    isLoading: candidatesLoading,
    isError: candidatesError,
    refetch: refetchCandidates,
  } = useAIMatchedCandidates(selectedJobId, appliedOnly);

  const unlockMutation = useUnlockCandidateProfile();

  // ================= AUTO-SELECT FIRST JOB =================
  const jobs = jobsData?.results || [];
  const totalJobPages = jobsData?.total_pages || 1;

  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  // ================= HANDLERS =================
  const handleSelectJob = (jobId) => {
    setSelectedJobId(jobId);
    setCandidateFilter("ai_matched"); // Reset filter when switching jobs
  };

  const handleJobPageChange = (page) => {
    setJobPage(page);
    setSelectedJobId(null); // Reset selection when changing pages
  };

  const handleViewProfile = (candidateId) => {
    const candidate = candidates.find((c) => c.candidate_id === candidateId);
    if (!candidate) return;

    const modalCandidate = {
      id: candidate.candidate_id,
      name: candidate.candidate_name,
      // Create fallback initials in case there's no photo
      avatar: (candidate.candidate_name || "?")
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      profile_photo_url: candidate.profile_photo_url,
      roles: [],
    };

    // Primary role
    modalCandidate.roles.push({
      role: candidate.ai_match?.role_applied || "—",
      score: Math.round(candidate.score || 0),
    });

    // Additional roles from interview_attempts
    if (candidate.interview_attempts) {
      candidate.interview_attempts.forEach((attempt) => {
        if (attempt.role) {
          modalCandidate.roles.push({
            role: attempt.role,
            score: Math.round(attempt.overall_score || 0),
          });
        }
      });
    }

    setCandidateToUnlock(modalCandidate);
  };

  const handleUnlockProfile = (candidateId, selectedExtras, totalCredits) => {
    unlockMutation.mutate(
      {
        candidate: candidateId,
        interview: selectedExtras,
      },
      {
        onSuccess: (data) => {
          showSuccess(
            data?.message || "Candidate Profile Unlocked successfully.",
          );
          setCandidateToUnlock(null);
        },
        onError: (error) => {
          showError(
            error?.response?.data?.message || "Failed to unlock profile.",
          );
        },
      },
    );
  };

  // ================= DERIVED DATA =================
  const candidates = candidatesData?.matches || [];
  const totalCandidates = candidatesData?.total_candidates || 0;
  const matchedCount = candidatesData?.matched_candidates_count || 0;

  // Find the selected job title for display
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="cp-page">
      {/* ================= HEADER ================= */}
      <div className="cp-header">
        <div className="cp-header-text">
          <h1>Candidate Pool</h1>
          <p className="cp-header-subtitle">
            Discover AI-matched candidates for your open positions.
          </p>
        </div>
      </div>

      {/* ================= STATS ROW ================= */}
      {jobsLoading && !jobsData ? (
        <CandidatePoolSkeleton variant="stats" />
      ) : (
        <div className="cp-stats-row">
          <div className="cp-stat-card">
            <div className="cp-stat-icon cp-stat-icon--blue">
              <i className="bi bi-briefcase" aria-hidden="true" />
            </div>
            <div>
              <div className="cp-stat-value">{jobsData?.count || 0}</div>
              <div className="cp-stat-label">Open Positions</div>
            </div>
          </div>

          <div className="cp-stat-card">
            <div className="cp-stat-icon cp-stat-icon--green">
              <i className="bi bi-people" aria-hidden="true" />
            </div>
            <div>
              <div className="cp-stat-value">{totalCandidates}</div>
              <div className="cp-stat-label">Total Candidates</div>
            </div>
          </div>

          <div className="cp-stat-card">
            <div className="cp-stat-icon cp-stat-icon--purple">
              <i className="bi bi-stars" aria-hidden="true" />
            </div>
            <div>
              <div className="cp-stat-value">{matchedCount}</div>
              <div className="cp-stat-label">AI Matches</div>
            </div>
          </div>
        </div>
      )}

      {/* ================= JOBS ERROR ================= */}
      {jobsError && (
        <EmptyState
          variant="error"
          icon="bi-exclamation-triangle"
          title="Failed to load jobs"
          description="We couldn't fetch your open positions. Please check your connection and try again."
          actionLabel="Retry"
          onAction={refetchJobs}
        />
      )}

      {/* ================= JOB SELECTOR ================= */}
      {!jobsError && (
        <JobSelector
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={handleSelectJob}
          isLoading={jobsLoading}
          currentPage={jobPage}
          totalPages={totalJobPages}
          onPageChange={handleJobPageChange}
        />
      )}

      {/* ================= NO OPEN JOBS ================= */}
      {!jobsLoading && !jobsError && jobs.length === 0 && (
        <EmptyState
          icon="bi-briefcase"
          title="No Open Jobs"
          description="You don't have any open positions yet. Post a job to start receiving AI-matched candidates."
          actionLabel="Post a Job"
          onAction={() => navigate("/employer/post-job")}
        />
      )}

      {/* ================= CANDIDATES SECTION ================= */}
      {selectedJobId && (
        <>
          {/* Candidates Header */}
          <div className="cp-candidates-header">
            <h2 className="cp-candidates-title">
              <i className="bi bi-people" aria-hidden="true" />
              Matched Candidates
              {selectedJob && (
                <span className="cp-candidates-count">
                  for {selectedJob.title}
                </span>
              )}
            </h2>
            <select
              id="cp-candidate-filter"
              className="cp-filter-select"
              value={candidateFilter}
              onChange={(e) => setCandidateFilter(e.target.value)}
            >
              <option value="ai_matched">AI Matched</option>
              <option value="applied">Applied</option>
            </select>
          </div>

          {/* Loading */}
          {candidatesLoading && <CandidatePoolSkeleton variant="candidates" />}

          {/* Error */}
          {candidatesError && !candidatesLoading && (
            <EmptyState
              variant="error"
              icon="bi-exclamation-triangle"
              title="Failed to load candidates"
              description="We couldn't fetch the matched candidates for this job. Please try again."
              actionLabel="Retry"
              onAction={refetchCandidates}
            />
          )}

          {/* Empty matches */}
          {!candidatesLoading &&
            !candidatesError &&
            candidates.length === 0 && (
              <EmptyState
                icon="bi-person-x"
                title="No Matches Yet"
                description="Our AI hasn't found matching candidates for this job yet. Check back later as more candidates take their interviews."
              />
            )}

          {/* Candidates Grid */}
          {!candidatesLoading && !candidatesError && candidates.length > 0 && (
            <div className="cp-candidates-grid">
              {candidates.map((candidate, index) => (
                <CandidateCard
                  key={`${candidate.candidate_id}-${index}`}
                  candidate={candidate}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= NO JOB SELECTED PROMPT ================= */}
      {!selectedJobId && !jobsLoading && !jobsError && jobs.length > 0 && (
        <div className="cp-select-prompt">
          <div className="cp-select-prompt-icon">
            <i className="bi bi-hand-index-thumb" aria-hidden="true" />
          </div>
          <h3>Select a Job Above</h3>
          <p>
            Choose one of your open positions to view AI-matched candidates.
          </p>
        </div>
      )}

      {/* ================= MODALS ================= */}
      {candidateToUnlock && (
        <UnlockProfileModal
          candidate={candidateToUnlock}
          onClose={() => setCandidateToUnlock(null)}
          onUnlock={handleUnlockProfile}
          isUnlocking={unlockMutation.isPending || unlockMutation.isLoading}
        />
      )}
    </div>
  );
}
