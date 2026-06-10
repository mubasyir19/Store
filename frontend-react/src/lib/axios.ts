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

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

function resolveQueue() {
  pendingQueue.forEach(({ resolve }) => resolve());
  pendingQueue = [];
}

function rejectQueue(error: unknown) {
  pendingQueue.forEach(({ reject }) => reject(error));
  pendingQueue = [];
}

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    // If there's no response or no status, reject
    const status = error?.response?.status;
    if (!status || !originalRequest) return Promise.reject(error);

    // Try to refresh session on 401 once
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Jika sudah ada proses refresh berjalan, antrekan request ini
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // Start proses refresh
      isRefreshing = true;

      try {
        // Attempt to refresh session using http-only cookie flow
        await refreshClient.post('/auth/refresh');

        resolveQueue();
        // Retry the original request after successful refresh
        return api(originalRequest);
      } catch (refreshError) {
        rejectQueue(refreshError);
        // If refresh fails, redirect to login (or reject)
        try {
          // Optional: call backend logout endpoint to clear server session
          await refreshClient.post('/auth/logout');
        } catch {
          // ignore logout errors
        }
        // Redirect user to login page so they can re-authenticate
        if (typeof window !== 'undefined') {
          // window.location.href = '/login';
          const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?returnTo=${returnTo}`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
