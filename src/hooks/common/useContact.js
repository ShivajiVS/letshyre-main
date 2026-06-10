import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitContactEnquiry } from "@/services/common/contact.service";

export const useContactMutation = () => {
  return useMutation({
    mutationFn: submitContactEnquiry,
    onSuccess: (data) => {
      toast.success(data?.message || "Contact enquiry submitted successfully.");
    },
    onError: (error) => {
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMsg);
    },
  });
};
