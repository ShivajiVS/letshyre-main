import api from "./api";
import { getErrorMessage } from "../utils/errorHandler";

/* ===============================
   STORAGE KEYS
================================ */
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

/* ===============================
   HELPER: SAFE RESPONSE PARSER
================================ */
const getResponseData = (res) => {
  return res?.data?.data || res?.data || {};
};

/* ===============================
   LOGIN
================================ */
export const login = async (credentials) => {
  try {
    const res = await api.post("/user/v1/login/", credentials);

    const data = getResponseData(res);

    const accessToken =
      data.access_token || data.access || data.token;

    const refreshToken =
      data.refresh_token || data.refresh;

    if (!accessToken) {
      console.error("LOGIN RESPONSE:", res.data);
      throw new Error("Access token not found in response");
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    localStorage.setItem(USER_KEY, JSON.stringify(data));

    return data;

  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/* ===============================
   LOGOUT
================================ */
export const logoutMe = async () => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      await api.post("/user/v1/logout/", {
        refresh: refreshToken,
      });
    }
  } catch (err) {
    console.warn("Logout API failed:", err?.message);
  } finally {
    localStorage.clear();
  }
};

/* ===============================
   FORGOT PASSWORD
================================ */
const forgotPassword = async (payload) => {
  try {
    const res = await api.post("/user/v1/forgot_password/", payload);
    return getResponseData(res);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/* ===============================
   REGISTER – SEND EMAIL OTP
================================ */
const sendRegisterEmailOtp = async (payload) => {
  try {
    const res = await api.post("/commonapp/v1/send_otp/", payload);
    return getResponseData(res);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/* ===============================
   VERIFY EMAIL OTP
================================ */
const verifyEmailOtp = async (payload) => {
  try {
    const res = await api.post("/commonapp/v1/verify_otp/", payload);
    return getResponseData(res);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/* ===============================
   SEND MOBILE OTP
================================ */
const sendMobileOtp = async (payload) => {
  try {
    const res = await api.post("/commonapp/v1/mobile_send_otp/", payload);
    return getResponseData(res);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/* ===============================
   VERIFY MOBILE OTP
================================ */
const verifyMobileOtp = async (payload) => {
  try {
    const res = await api.post("/commonapp/v1/mobile_verify_otp/", payload);
    return getResponseData(res);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/* ===============================
   FINAL REGISTER
================================ */
const finalRegister = async (payload) => {
  try {
    const res = await api.post("/user/v1/user_register/", payload);
    return getResponseData(res);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/* ===============================
   TOKEN HELPERS
================================ */
const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const setAccessToken = (token) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, token);

const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

/* ===============================
   USER HELPERS
================================ */
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const isAuthenticated = () => !!getAccessToken();

/* ===============================
   EXPORT
================================ */
export default {
  // auth
  login,
  logoutMe,
  forgotPassword,

  // register + otp
  sendRegisterEmailOtp,
  verifyEmailOtp,
  sendMobileOtp,
  verifyMobileOtp,
  finalRegister,

  // helpers
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  getCurrentUser,
  isAuthenticated,
};