import { useMutation, useQuery } from "@tanstack/react-query";
import { profileService } from "../../services/employee/profile.service";

export const useGetIndustries = () => {
  return useQuery({
    queryKey: ["industries"],
    queryFn: profileService.getIndustries,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
};

export const useUploadResume = () => {
  return useMutation({
    mutationFn: profileService.uploadResume,
  });
};

export const useCheckResumeStatus = () => {
  return useMutation({
    mutationFn: profileService.checkResumeStatus,
  });
};

export const useGetParsedResumeData = () => {
  return useMutation({
    mutationFn: profileService.getParsedResumeData,
  });
};

export const useGetSkillsForRole = () => {
  return useMutation({
    mutationFn: profileService.getSkillsForRole,
  });
};

export const useSubmitProfile = () => {
  return useMutation({
    mutationFn: profileService.submitProfile,
  });
};
