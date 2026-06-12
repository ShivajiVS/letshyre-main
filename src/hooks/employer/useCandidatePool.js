import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchOpenJobs,
  fetchAIMatchedCandidates,
  fetchCandidateInterviews,
  unlockCandidateProfile,
} from "@/services/employer/candidatePool.service";

/**
 * Fetch paginated open jobs for the candidate pool job selector.
 */
export const useOpenJobs = (page = 1) => {
  return useQuery({
    queryKey: ["openJobs", { page, status: "Open" }],
    queryFn: async () => {
      const res = await fetchOpenJobs({ page });
      const responseData = res.data?.data || res.data;
      return {
        results: responseData?.results || [],
        count: responseData?.count || 0,
        total_pages: responseData?.total_pages || 1,
        current_page: responseData?.current_page || 1,
      };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Fetch AI-matched candidates for a selected job.
 * Only runs when jobId is provided.
 */
export const useAIMatchedCandidates = (jobId, appliedOnly = false) => {
  return useQuery({
    queryKey: ["aiMatchedCandidates", jobId, { appliedOnly }],
    queryFn: async () => {
      const res = await fetchAIMatchedCandidates(jobId, { appliedOnly });
      const responseData = res.data?.data || res.data;
      return {
        matches: responseData?.matches || [],
        total_candidates: responseData?.total_candidates || 0,
        matched_candidates_count: responseData?.matched_candidates_count || 0,
        ai_total_candidates: responseData?.ai_total_candidates || 0,
      };
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch past interviews for a specific candidate.
 */
export const useCandidateInterviews = (candidateId) => {
  return useQuery({
    queryKey: ["candidateInterviews", candidateId],
    queryFn: async () => {
      const res = await fetchCandidateInterviews(candidateId);
      return res.data?.data || [];
    },
    enabled: !!candidateId,
  });
};

/**
 * Unlock a candidate profile with selected interviews.
 */
export const useUnlockCandidateProfile = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await unlockCandidateProfile(data);
      return res.data;
    },
  });
};
