import { useQuery } from "@tanstack/react-query";
import { getApplicants } from "@/services/employer/applicantService";

export const useApplicants = (jobId, page) => {
  return useQuery({
    queryKey: ["applicants", jobId, page],
    queryFn: () => getApplicants(jobId, page),
    enabled: !!jobId,
    placeholderData: (previousData) => previousData, // Keeps previous data on screen while fetching next page
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
