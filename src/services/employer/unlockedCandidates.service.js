import api from "@/services/api";

/**
 * Fetch unlocked candidates for the employer.
 * GET /user/v1/employer_unlock_candidate/
 */
export const fetchUnlockedCandidates = async () => {
  const response = await api.get("/user/v1/employer_unlock_candidate/");
  return response.data;
};
