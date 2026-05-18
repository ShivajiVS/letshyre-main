import api from "./api";

/* ===============================
   JOB SERVICES
================================ */

/**
 * Get all jobs
 */
const getAllJobs = async (params = {}) => {
  try {
    const response = await api.get("/jobs/", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch jobs" };
  }
};

/**
 * Get single job by ID
 */
const getJobById = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch job details" };
  }
};

/**
 * Apply for a job
 */
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
