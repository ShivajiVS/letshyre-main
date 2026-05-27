import { useInfiniteQuery } from "@tanstack/react-query";
import { getCandidateApplications } from "@/services/employee/applications.service";

export const CANDIDATE_APPLICATIONS_KEY = "candidateApplications";

export const useCandidateApplications = (status) => {
  return useInfiniteQuery({
    queryKey: [CANDIDATE_APPLICATIONS_KEY, status],
    queryFn: ({ pageParam = 1 }) => getCandidateApplications({ pageParam, status }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};
