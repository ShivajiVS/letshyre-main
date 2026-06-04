import { useQuery } from "@tanstack/react-query";
import { getScorecardDetail } from "@/services/employee/scorecardDetail.service";

export const SCORECARD_DETAIL_KEY = "scorecardDetail";

export const useScorecardDetail = (id) => {
  return useQuery({
    queryKey: [SCORECARD_DETAIL_KEY, id],
    queryFn: () => getScorecardDetail(id),
    enabled: !!id, // Only fetch if ID is available
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
