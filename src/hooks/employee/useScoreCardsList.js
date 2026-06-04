import { useQuery } from "@tanstack/react-query";
import { getCandidateScorecard } from "@/services/employee/scorecard.service";

export const SCORE_CARDS_LIST_KEY = "scoreCardsList";

export const useScoreCardsList = () => {
  return useQuery({
    queryKey: [SCORE_CARDS_LIST_KEY],
    queryFn: getCandidateScorecard,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 (Empty state)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    }
  });
};
