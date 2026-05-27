import api from "@/services/api";

export const dashboardService = {
  // Get employer profile
  getEmployerProfile: async () => {
    const res = await api.get("/user/v1/employer_profile/");
    return res.data?.data || res.data;
  },

  // Get employer credits
  getEmployerCredits: async () => {
    const res = await api.get("/payment/v1/employer_credits/");
    return res.data?.data || res.data;
  },

  // Get team members (and count)
  getTeamMembers: async () => {
    const res = await api.get("/user/v1/employer_team_members/");
    return res.data?.data || res.data;
  },

  // Invite a new team member
  inviteTeamMember: async (payload) => {
    const res = await api.post("/user/v1/employer_team_members/", payload);
    return res.data;
  },
};
