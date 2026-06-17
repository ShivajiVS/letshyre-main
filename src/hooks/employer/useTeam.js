import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamService } from "@/services/employer/team.service";

const TEAM_KEYS = {
  all: ["teamMembers"],
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: TEAM_KEYS.all,
    queryFn: teamService.getMembers,
    select: (data) => data?.data?.results || [],
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamService.addMember,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
      }
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamService.updateMember,
    onSuccess: (res) => {
      if (res.success || res.message === "Status Update Successfully") {
        queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
      }
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamService.deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
    },
  });
};
