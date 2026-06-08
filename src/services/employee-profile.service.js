import api from "./api";

export async function candidateProfile() {
  const res = await api.get(`/user/v1/candidate_profile/`);
  return res.data;
}

export const getCandidateProfile = () =>
  api.post("/user/v1/candidate_profile/").then((r) => r.data?.data ?? r.data);
