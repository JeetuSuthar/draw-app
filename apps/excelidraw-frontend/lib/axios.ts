import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: HTTP_BACKEND,
    headers: {
        "Content-Type": "application/json",
    }
});

// Add request interceptor to include JWT token
AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            // Send token directly without "Bearer " prefix
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

