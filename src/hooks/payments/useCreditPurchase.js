import { useQuery, useMutation } from "@tanstack/react-query";
import {
  calculateCreditCost,
  createRazorpayOrder,
  verifyRazorpayOrder,
} from "../../services/payments/purchases-credits.service";

// Hook to calculate cost based on tokens
export const useCalculateCost = (tokens) => {
  return useQuery({
    queryKey: ["calculateCost", tokens],
    queryFn: () => calculateCreditCost(tokens),
    enabled: !!tokens && tokens > 0, // Only run if tokens is a valid number > 0
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
  });
};

// Hook to create order
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload) => createRazorpayOrder(payload),
  });
};

// Hook to verify order
export const useVerifyOrder = () => {
  return useMutation({
    mutationFn: (payload) => verifyRazorpayOrder(payload),
  });
};
