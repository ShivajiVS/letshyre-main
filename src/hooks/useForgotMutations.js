import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import authService from "@/services/auth.service";

export const useForgotSendOtpMutation = () => {
  return useMutation({
    mutationFn: (data) => authService.sendRegisterEmailOtp({
      email: data.email,
      otp_type: "Forgot Password",
    }),
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message || "Failed to send OTP. Please try again.");
    },
  });
};

export const useForgotVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: (data) => authService.verifyEmailOtp({
      email: data.email,
      otp_session_key: data.otpSessionKey,
      otp: data.otp,
      otp_type: "Forgot Password",
    }),
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message || "Invalid OTP. Please try again.");
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data) => authService.forgotPassword({
      email: data.email,
      otp_session_key: data.otpSessionKey,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    }),
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message || "Password reset failed. Please try again.");
    },
  });
};
