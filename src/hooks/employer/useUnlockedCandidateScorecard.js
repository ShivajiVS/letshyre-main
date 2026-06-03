import { useQuery } from "@tanstack/react-query";
import { fetchUnlockedCandidateScorecard } from "@/services/employer/unlockedCandidateScorecard.service";

/**
 * React Query hook to fetch the scorecard for an unlocked candidate.
 * 
 * @param {string} id - The ID of the unlocked candidate record.
 */
export const useUnlockedCandidateScorecard = (id) => {
  return useQuery({
    queryKey: ["unlockedCandidateScorecard", id],
    queryFn: () => fetchUnlockedCandidateScorecard(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
