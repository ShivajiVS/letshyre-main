import axios from "axios";

/* ===============================
   STORAGE KEYS
================================ */
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/* ===============================
   AXIOS INSTANCE
================================ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // https://api.letshyre.com
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   TOKEN HELPERS
================================ */
const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

const getRefreshToken = () => {
  // Primary key
  const direct = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (direct) return direct;
  // Fallback: read from the stored user object
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.refresh_token || user?.refresh || null;
  } catch {
    return null;
  }
};

/* ===============================
   CLEAR AUTH STORAGE (selective)
================================ */
const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("user");
  // intentionally keep profileCompleted, UI prefs, etc.
};

/* ===============================
   PUBLIC ROUTES (NO AUTH HEADER)
================================ */
const publicEndpoints = [
  "/user/v1/login/",
  "/user/v1/login",
  "/user/v1/login_refresh/",
  "/user/v1/login_refresh",
  "/commonapp/v1/send_otp/",
  "/commonapp/v1/verify_otp/",
];

/* ===============================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    const isPublic = publicEndpoints.some((url) =>
      config.url?.includes(url)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   TOKEN REFRESH QUEUE
================================ */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const skipRefreshUrls = [
      "/user/v1/login/",
      "/user/v1/login",
      "/user/v1/login_refresh/",
      "/user/v1/login_refresh",
      "/user/v1/logout/",
    ];

    const isAuthCall = skipRefreshUrls.some((url) =>
      originalRequest.url?.includes(url)
    );

    /* Don't try refresh on login errors */
    if (isAuthCall) {
      return Promise.reject(error);
    }

    /* ===============================
       HANDLE 401 TOKEN EXPIRED
    ================================ */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest._retry = true;          // prevent re-refresh on queued retries
              originalRequest.headers.Authorization =
                `Bearer ${token}`;

              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        /* ===============================
           REFRESH ACCESS TOKEN
        ================================ */
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/user/v1/login_refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const response = res.data;
        const data = response.data || response;

        const newAccessToken =
          data.access_token ||
          data.access ||
          data.token;

        if (!newAccessToken) {
          throw new Error("No new access token returned");
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

        // ── Save the NEW refresh token if the server rotates it ──
        // Django Simple JWT (ROTATE_REFRESH_TOKENS=True) invalidates the old
        // refresh token and issues a new one. Failing to save it means the
        // next refresh will use a blacklisted token and always fail.
        const newRefreshToken =
          data.refresh_token || data.refresh;
        if (newRefreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        processQueue(refreshError, null);

        console.error(
          "TOKEN REFRESH FAILED:",
          refreshError
        );

        isRefreshing = false;        // reset BEFORE navigation
        clearAuthStorage();

        window.location.href = "/get-started";

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;        // safe to call again — idempotent
      }
    }

    return Promise.reject(error);
  }
);

export default api;