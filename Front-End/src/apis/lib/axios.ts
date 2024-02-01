import axios from "axios";
import { useAuthStore } from "../../stores/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: "http://i10a210.p.ssafy.io:8080",
  withCredentials: true, //쿠키 포함
});

//accessToken 자동으로 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && config.headers) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

//401에러 발생 시 로그아웃 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      useAuthStore.getState().setAccessToken(null);
    }
    return Promise.reject(error);
  }
);
