import { useQuery } from "@tanstack/react-query";
import {
  fetchOpenJobs,
  fetchAIMatchedCandidates,
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
export const useAIMatchedCandidates = (jobId) => {
  return useQuery({
    queryKey: ["aiMatchedCandidates", jobId],
    queryFn: async () => {
      const res = await fetchAIMatchedCandidates(jobId);
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
