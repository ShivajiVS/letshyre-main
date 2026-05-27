import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateFindJobs,
  getIndustriesList,
  applyForJob,
} from "@/services/employee/findJobs.service";

/* ===========================
   QUERY KEYS
   =========================== */
export const FIND_JOBS_KEY = "candidateFindJobs";
export const INDUSTRIES_KEY = "industries";

/* ===========================
   useFindJobs
   —————————————————————————
   Server-side filtered job listing.
   `filters` is an object with any combination of:
     job_search, location, employment_type,
     industry_type, salary_range, experience_required, page
   =========================== */
export const useFindJobs = (filters = {}) => {
  return useQuery({
    queryKey: [FIND_JOBS_KEY, filters],
    queryFn: () => getCandidateFindJobs(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    placeholderData: (previousData) => previousData, // keep previous data while new loads (React Query v5)
  });
};

/* ===========================
   useIndustries
   —————————————————————————
   Fetches once and caches aggressively
   (industry list rarely changes).
   =========================== */
export const useIndustries = () => {
  return useQuery({
    queryKey: [INDUSTRIES_KEY],
    queryFn: getIndustriesList,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/* ===========================
   useApplyForJob
   —————————————————————————
   Mutation to apply for a job.
   Invalidates the jobs list on success so
   the "Applied" badge appears immediately.
   =========================== */
export const useApplyForJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId) => applyForJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FIND_JOBS_KEY] });
    },
  });
};
