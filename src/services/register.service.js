import api from "./api";

/* ================= EMAIL OTP ================= */

// Send email OTP (Registration)
export const sendEmailOtp = async (email) => {
  const response = await api.post("/commonapp/v1/send_otp/", {
    email,
    otp_type: "Registration",
  });

  return response.data; // includes otp_session_key
};

// Verify email OTP
export const verifyEmailOtp = async (otpSessionKey, otp) => {
  const response = await api.post("/commonapp/v1/verify_otp/", {
    otp_session_key: otpSessionKey,
    otp,
  });

  return response.data;
};

/* ================= MOBILE OTP ================= */

// Send mobile OTP
export const sendMobileOtp = (fullMobileNumber) => {
  return api.post("/commonapp/v1/mobile_send_otp/", {
    mobile: fullMobileNumber,
  });
};

// Verify mobile OTP
export const verifyMobileOtp = (fullMobileNumber, otp) => {
  return api.post("/commonapp/v1/mobile_verify_otp/", {
    mobile: fullMobileNumber,
    otp,
  });
};
