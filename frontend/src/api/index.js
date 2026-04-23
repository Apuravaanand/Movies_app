import axios from "axios";
export const BASE_URL = "http://localhost:5000";
export const API_URL = `${BASE_URL}/api/v1`;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const getImageUrl = (path) => {
    if (!path) return "/default-poster.jpg";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

export default api;
