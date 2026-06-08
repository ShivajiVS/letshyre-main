import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitEmployerOnboarding, getIndustriesList } from "@/services/employer/onboarding.service";

export const useSubmitOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitEmployerOnboarding,
    onSuccess: (data) => {
      // Invalidate dashboard or employer profile queries if necessary
      queryClient.invalidateQueries({ queryKey: ["employerProfile"] });
    },
  });
};

export const useIndustriesList = () => {
  return useQuery({
    queryKey: ["industriesList"],
    queryFn: getIndustriesList,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    select: (data) => data?.data || [],
  });
};
