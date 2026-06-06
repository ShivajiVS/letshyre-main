import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import authService from "@/services/auth.service";

export const useSendEmailOtpMutation = () => {
  return useMutation({
    mutationFn: (data) =>
      authService.sendRegisterEmailOtp({
        email: data.email,
        otp_type: "Registration",
      }),
    onError: (error) => {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    },
  });
};

export const useVerifyEmailOtpMutation = () => {
  return useMutation({
    mutationFn: (data) =>
      authService.verifyEmailOtp({
        email: data.email,
        otp_session_key: data.otpSessionKey,
        otp: data.otp,
        otp_type: data.otp_type,
      }),
    onError: (error) => {
      toast.error(error.message || "Invalid OTP. Please try again.");
    },
  });
};

export const useSendMobileOtpMutation = () => {
  return useMutation({
    mutationFn: (data) =>
      authService.sendMobileOtp({
        phone_number: data.phone_number,
        otp_type: "Registration",
      }),
    onError: (error) => {
      toast.error(error.message || "Failed to send Mobile OTP.");
    },
  });
};

export const useVerifyMobileOtpMutation = () => {
  return useMutation({
    mutationFn: (data) =>
      authService.verifyMobileOtp({
        phone_number: data.phone_number,
        otp_session_key: data.otpSessionKey,
        otp: data.otp,
      }),
    onError: (error) => {
      toast.error(error.message || "Invalid Mobile OTP.");
    },
  });
};

export const useFinalRegisterMutation = () => {
  return useMutation({
    mutationFn: (data) => authService.finalRegister(data),
    onError: (error) => {
      toast.error(error.message || "Registration failed.");
    },
  });
};
