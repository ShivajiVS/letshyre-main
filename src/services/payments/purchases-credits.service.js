import api from "../api";

export const calculateCreditCost = async (tokens) => {
  const response = await api.get(`/payment/v1/employer/calculate-token-cost/?tokens=${tokens}`);
  return response.data;
};

export const createRazorpayOrder = async (payload) => {
  const response = await api.post(`/payment/v1/create_razorpay_order/`, payload);
  return response.data;
};

export const verifyRazorpayOrder = async (payload) => {
  const response = await api.post(`/payment/v1/verify_razorpay_order/`, payload);
  return response.data;
};