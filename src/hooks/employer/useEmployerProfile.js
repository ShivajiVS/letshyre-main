import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployerProfile,
  updateEmployerKyc,
} from "@/services/employer/employerProfileService";
import { toast } from "react-toastify";

// Key for profile query
export const PROFILE_QUERY_KEY = ["employerProfile"];

export const useGetEmployerProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getEmployerProfile,
    staleTime: 2 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployerKyc,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    onError: (error) => {
      console.error("KYC Update Error:", error);
      toast.error("Failed to update profile");
    },
  });
};
