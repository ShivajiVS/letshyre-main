import api from "@/services/api";

/**
 * Fetch employer's open jobs (paginated).
 * GET /user/v1/employer_jobs/?status=Open&page={page}
 */
export const fetchOpenJobs = (params) => {
  return api.get("/user/v1/employer_jobs/", {
    params: { status: "Open", ...params },
  });
};

/**
 * Fetch AI-matched candidates for a specific job.
 * GET /user/v1/employer_job_ai/matching/{jobId}/
 */
export const fetchAIMatchedCandidates = (jobId) => {
  return api.get(`/user/v1/employer_job_ai/matching/${jobId}/`);
};
