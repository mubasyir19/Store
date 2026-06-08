import axios, { type AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// A minimal request interceptor (keeps request config intact)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Separate client used for token refresh to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    // If there's no response or no status, reject
    const status = error?.response?.status;
    if (!status) return Promise.reject(error);

    // Try to refresh session on 401 once
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh session using http-only cookie flow
        await refreshClient.post('/auth/refresh');

        // Retry the original request after successful refresh
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login (or reject)
        try {
          // Optional: call backend logout endpoint to clear server session
          await refreshClient.post('/auth/logout');
        } catch {
          // ignore logout errors
        }
        // Redirect user to login page so they can re-authenticate
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
