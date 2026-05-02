import axios from "axios";
import { baseURL } from "../api/SummaryApi";

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// ================= REQUEST =================
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= REFRESH CONTROL =================
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ================= RESPONSE =================
Axios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 🔴 ACCESS TOKEN EXPIRED
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // ❌ No refresh token → logout
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      // 🔁 IF ALREADY REFRESHING → QUEUE REQUESTS
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(Axios(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        // 🔥 CALL REFRESH API
        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          null,
          {
            params: { refreshToken },
          }
        );

        console.log("Token refreshed successfully");
        console.log("New Access Token:", res);
        

        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        // SAVE NEW TOKENS
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // UPDATE HEADER
        Axios.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return Axios(originalRequest);

      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ================= LOGOUT =================
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  sessionStorage.setItem(
    "redirectAfterLogin",
    JSON.stringify({
      path: window.location.pathname,
    })
  );

  window.location.href = "/login";
};

export default Axios;