import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import authService from "@/services/auth.service";

export const useLoginMutation = (role) => {
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      toast.success("Login successful");
      const defaultRedirect = role === "employer" ? "/employer" : "/employee";
      const redirectTo = location.state?.from?.pathname || defaultRedirect;
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });
};
