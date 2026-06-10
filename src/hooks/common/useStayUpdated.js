import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "@/services/common/common.service";
import { toast } from "sonner";

export const useStayUpdated = () => {
  return useMutation({
    mutationFn: (email) => subscribeToNewsletter(email),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message || "Subscription saved successfully.");
      } else {
        toast.error(data?.message || "Something went wrong. Please try again.");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to subscribe. Please try again.";
      toast.error(errorMessage);
    },
  });
};
