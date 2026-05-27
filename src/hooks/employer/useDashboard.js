import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "@/services/employer/dashboard.service";

export const useEmployerProfile = () => {
  return useQuery({
    queryKey: ["employerProfile"],
    queryFn: dashboardService.getEmployerProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useEmployerCredits = () => {
  return useQuery({
    queryKey: ["employerCredits"],
    queryFn: dashboardService.getEmployerCredits,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["employerTeamMembers"],
    queryFn: dashboardService.getTeamMembers,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useInviteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dashboardService.inviteTeamMember,
    onSuccess: () => {
      // Invalidate the team members query so it refetches and updates the count
      queryClient.invalidateQueries({ queryKey: ["employerTeamMembers"] });
    },
  });
};
