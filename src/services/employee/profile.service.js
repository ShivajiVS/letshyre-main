import api from "../api";

export const profileService = {
  getIndustries: async () => {
    const response = await api.get("/user/v1/industries/list/");
    return response.data;
  },

  uploadResume: async (formData) => {
    const response = await api.post(
      "/user/v1/candidate_resume_ai/upload/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  checkResumeStatus: async (jobId) => {
    const response = await api.get(
      `/user/v1/candidate_resume_ai/status/${jobId}/`
    );
    return response.data;
  },

  getParsedResumeData: async (jobId) => {
    const response = await api.get(
      `/user/v1/candidate_resume_ai/review_data/${jobId}/`
    );
    return response.data;
  },

  getSkillsForRole: async (role) => {
    const response = await api.post(
      "/user/v1/candidate_resume_ai/skills_for_role/",
      { role }
    );
    return response.data;
  },

  submitProfile: async (formData) => {
    const response = await api.post("/user/v1/candidate_profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
