import axios from "axios";
import config from "../config/config";
import { logout } from "../store/actions/auth/logout";
import { type AppDispatch } from "../store";


const axiosInstance = axios.create({
    baseURL: config.backendUrl,
    withCredentials: true,
})

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
    let isRefreshing = false;
    let failedQueue: {
      resolve: (value?: unknown) => void;
      reject: (reason?: unknown) => void;
    }[] = [];
  
    const processQueue = (error: unknown, response = null) => {
      failedQueue.forEach((prom) => {
        if (response) {
          prom.resolve(response);
        } else {
          prom.reject(error);
        }
      });
      failedQueue = [];
    };
  
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
  
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: () => resolve(axiosInstance(originalRequest)),
                reject: (err) => reject(err),
              });
            });
          }
  
          originalRequest._retry = true;
          isRefreshing = true;
  
          try {
            await axiosInstance.post("/user/token/refresh");
            processQueue(null);
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            dispatch(logout());
            processQueue(refreshError);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
  
        return Promise.reject(error);
      }
    );
  };


export default axiosInstance