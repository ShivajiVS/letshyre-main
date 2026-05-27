import { useQuery } from "@tanstack/react-query";
import { getCandidateProfile } from "@/services/employee-profile.service";

export const CANDIDATE_PROFILE_KEY = ["candidateProfile"];

export const useCandidateProfile = () =>
  useQuery({
    queryKey: CANDIDATE_PROFILE_KEY,
    queryFn: getCandidateProfile,
    staleTime: 5 * 60 * 1000,
  });
