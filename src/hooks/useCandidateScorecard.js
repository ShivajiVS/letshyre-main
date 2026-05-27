import { useQuery } from "@tanstack/react-query";
import { getCandidateScorecard } from "@/services/employee/scorecard.service";

export const CANDIDATE_SCORECARD_KEY = "candidateScorecard";

export const useCandidateScorecard = () => {
  return useQuery({
    queryKey: [CANDIDATE_SCORECARD_KEY],
    queryFn: getCandidateScorecard,
  });
};
