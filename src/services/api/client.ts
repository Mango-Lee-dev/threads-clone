import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { ApiError } from "@/src/types";

const API_BASE_URL = "";

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 에러 핸들링 및 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;

    // 401 에러 시 토큰 갱신 시도
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          await SecureStore.setItemAsync("accessToken", accessToken);

          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    // 에러 메시지 정제
    const apiError: ApiError = {
      error: error.response?.data?.error || "알 수 없는 오류가 발생했습니다.",
      message: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
