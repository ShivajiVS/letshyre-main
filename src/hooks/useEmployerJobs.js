import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchJobs,
  fetchKyc,
  deleteJob,
  getJobDetail,
  updateJob,
  patchJobStatus,
} from "@/services/employerApi";

const fetchJobsWithFilters = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  const { status, approval_status } = params || {};
  const res = await fetchJobs();
  let data = Array.isArray(res.data) ? res.data : res.data?.data || [];

  // Filter by status if provided
  if (status) {
    const lower = status.toLowerCase();
    data = data.filter((j) => (j.status || "").toLowerCase() === lower);
  }

  // Filter by approval_status if provided (pending means not approved)
  if (approval_status) {
    if (approval_status === "pending") {
      data = data.filter(
        (j) => String(j.job_status).toLowerCase() !== "approved",
      );
    }
  }

  // Enrich with KYC data (optional)
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
    data = data.map((j) => {
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

  return data;
};

export const useJobs = (params) => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: fetchJobsWithFilters,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
