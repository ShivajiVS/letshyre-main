import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchJobs,
  fetchKyc,
  deleteJob,
  getJobDetail,
  updateJob,
  patchJobStatus,
} from "@/services/employer/jobs.service";

const fetchJobsWithKyc = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  
  // Clean up params (e.g. remove "all" status if we want to fetch everything)
  const apiParams = { ...params };
  if (apiParams.status && apiParams.status.toLowerCase() === "all") {
    delete apiParams.status;
  }

  const res = await fetchJobs(apiParams);
  const responseData = res.data?.data || res.data;
  let jobsList = responseData?.results || [];

  // Fetch KYC to map company names and logos
  try {
    const kycRes = await fetchKyc();
    const kycData = kycRes.data?.data || kycRes.data;
    const kycMap = {};
    if (Array.isArray(kycData)) {
      kycData.forEach((k) => {
        kycMap[k.employer] = k;
      });
    } else if (kycData && typeof kycData === "object") {
      kycMap[kycData.employer] = kycData;
    }
    jobsList = jobsList.map((j) => {
      const kyc = kycMap[j.employer] || {};
      const isApproved = String(j.job_status).toLowerCase() === "approved";
      return {
        ...j,
        company: kyc.company_name || "Your Company",
        logo:
          kyc.company_logo ||
          "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
        isApproved,
        status: isApproved ? (j.status || "open").toLowerCase() : "pending",
      };
    });
  } catch (e) {
    console.warn("KYC fetch failed:", e);
  }

  // Return the full paginated response with enriched results
  return {
    ...responseData,
    results: jobsList,
  };
};

export const useJobs = (params) => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: fetchJobsWithKyc,
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
};

export const useJobDetail = (jobId, enabled = true) => {
  return useQuery({
    queryKey: ["jobDetail", jobId],
    queryFn: () =>
      getJobDetail(jobId).then((res) => res.data?.data || res.data),
    enabled,
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId) => deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, payload }) => updateJob(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const usePatchJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, status }) => patchJobStatus(jobId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
