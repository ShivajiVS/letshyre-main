import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchJobs,
  deleteJob,
  getJobDetail,
  updateJob,
  patchJobStatus,
  parseJD,
  createJob,
  getIndustries,
} from "@/services/employer/jobs.service";

const fetchJobsList = async ({ queryKey }) => {
  const [_key, params] = queryKey;

  // Clean up params (e.g. remove "all" status if we want to fetch everything)
  const apiParams = { ...params };
  if (apiParams.status && apiParams.status.toLowerCase() === "all") {
    delete apiParams.status;
  }

  const res = await fetchJobs(apiParams);
  const responseData = res.data?.data || res.data;
  let jobsList = responseData?.results || [];

  jobsList = jobsList.map((j) => {
    const isApproved = String(j.job_status).toLowerCase() === "approved";
    return {
      ...j,
      isApproved,
      status: isApproved ? (j.status || "open").toLowerCase() : "pending",
    };
  });

  // Return the full paginated response with enriched results
  return {
    ...responseData,
    results: jobsList,
  };
};

export const useJobs = (params) => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: fetchJobsList,
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
      toast.success("Job deleted successfully!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete job.");
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, payload }) => updateJob(jobId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({
        queryKey: ["jobDetail", variables.jobId],
      });
      toast.success("Job updated successfully!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update job.");
    },
  });
};

export const usePatchJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, status }) => patchJobStatus(jobId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({
        queryKey: ["jobDetail", variables.jobId],
      });
      toast.success(`Job status updated to ${variables.status}!`);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to update job status.",
      );
    },
  });
};

export const useIndustries = () => {
  return useQuery({
    queryKey: ["industries"],
    queryFn: () => getIndustries().then((res) => res.data?.data || res.data),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};

export const useParseJD = () => {
  return useMutation({
    mutationFn: (formData) => parseJD(formData),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
