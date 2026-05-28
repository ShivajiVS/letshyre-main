import api from "@/services/api";

export const fetchKyc = () => {
  return api.get("/user/v1/employer_kyc/");
};

export const fetchJobs = (params) => {
  return api.get("/user/v1/employer_jobs/", { params });
};

export const deleteJob = (jobId) => {
  return api.delete(`/user/v1/employer_job_detail/${jobId}/`);
};

export const getJobDetail = (jobId) => {
  return api.get(`/user/v1/employer_job_detail/${jobId}/`);
};

export const updateJob = (jobId, payload) => {
  return api.patch(`/user/v1/employer_job_detail/${jobId}/`, payload);
};

export const patchJobStatus = (jobId, status) => {
  return api.patch(`/user/v1/employer_job_detail/${jobId}/`, { status });
};
