import axios from "axios";
import $axios from "./axios";

const $api = axios.create({
  baseURL: `${process.env.API_URL}/api`,
  withCredentials: true,
});

$api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  return config;
});

$api.interceptors.response.use(
  config => {
    return config;
  },
  async err => {
    const originalRequest = err.config;
    if (err.response.status === 401 && originalRequest && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true;
        const { data } = await $axios.get("/auth/refresh");
        localStorage.setItem("accessToken", data.accessToken);
        return $api.request(originalRequest);
      } catch (error) {
        console.log(error);
      }
    }
    throw err;
  }
);

export default $api;
