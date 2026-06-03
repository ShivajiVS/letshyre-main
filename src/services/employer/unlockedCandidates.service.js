import api from "@/services/api";

/**
 * Fetch unlocked candidates for the employer.
 * GET /user/v1/employer_unlock_candidate/
 */
export const fetchUnlockedCandidates = async () => {
  const response = await api.get("/user/v1/employer_unlock_candidate/");
  return response.data;
};

/**
 * Fetch a specific unlocked candidate profile by ID.
 * GET /user/v1/employer_unlock_candidate/[id]/
 */
export const fetchUnlockedCandidateProfile = async (id) => {
  const response = await api.get(`/user/v1/employer_unlock_candidate/${id}/`);
  return response.data;
};
