import api from "./api";

const getAllJobs = async (params = {}) => {
  try {
    const response = await api.get("/jobs/", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch jobs" };
  }
};

const getJobById = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch job details" };
  }
};

const applyForJob = async (jobId) => {
  try {
    const response = await api.post(`/jobs/${jobId}/apply/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Job application failed" };
  }
};

const jobsService = {
  getAllJobs,
  getJobById,
  applyForJob,
};

export default jobsService;
