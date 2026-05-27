import api from '@/services/api';

export const fetchJobs = () => api.get('/user/v1/employer_jobs/');
export const fetchKyc = () => api.get('/user/v1/employer_kyc/');
export const deleteJob = (jobId) => api.delete(`/user/v1/employer_job_detail/${jobId}/`);
export const getJobDetail = (jobId) => api.get(`/user/v1/employer_job_detail/${jobId}/`);
export const updateJob = (jobId, payload) => api.patch(`/user/v1/employer_job_detail/${jobId}/`, payload);
export const patchJobStatus = (jobId, status) => api.patch(`/user/v1/employer_job_detail/${jobId}/`, { status });
