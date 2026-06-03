import { useQuery } from "@tanstack/react-query";
import { fetchUnlockedCandidates } from "@/services/employer/unlockedCandidates.service";

/**
 * Hook to fetch all unlocked candidates for the employer.
 */
export const useUnlockedCandidates = () => {
  return useQuery({
    queryKey: ["unlockedCandidates"],
    queryFn: async () => {
      const response = await fetchUnlockedCandidates();
      if (response?.success) {
        return response.data || [];
      }
      throw new Error(response?.message || "Failed to fetch unlocked candidates");
    },
    // Keep data fresh to avoid stale unlocked profiles
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
