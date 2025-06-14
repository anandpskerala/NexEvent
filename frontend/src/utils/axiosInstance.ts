import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import config from "../config/config";
import { logout } from "../store/actions/auth/logout";
import { type AppDispatch } from "../store";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.backendUrl,
  withCredentials: true,
});

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, response?: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(response);
    }
  });
  failedQueue = [];
};

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Wait until token is refreshed and retry the original request
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: () => resolve(axiosInstance(originalRequest)),
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          await axios.post(
            `${config.backendUrl}/user/token/refresh`,
            {},
            {
              withCredentials: true,
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          processQueue(null, true);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          dispatch(logout());
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
