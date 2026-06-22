import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { logoutMe } from "@/services/auth.service";

export const useEmployeeLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutMe,
    onSuccess: () => {
      navigate("/");
      setTimeout(() => {
        queryClient.clear();
      }, 10);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
