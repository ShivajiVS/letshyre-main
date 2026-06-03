import { useQuery } from "@tanstack/react-query";
import { fetchUnlockedCandidateProfile } from "@/services/employer/unlockedCandidates.service";

/**
 * Hook to fetch a specific unlocked candidate profile by ID.
 * @param {string} id - The ID of the unlocked candidate record.
 */
export const useUnlockedCandidateProfile = (id) => {
  return useQuery({
    queryKey: ["unlockedCandidateProfile", id],
    queryFn: async () => {
      const response = await fetchUnlockedCandidateProfile(id);
      if (response?.success) {
        return response.data || null;
      }
      throw new Error(response?.message || "Failed to fetch candidate profile");
    },
    enabled: !!id, // Only run the query if an ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
