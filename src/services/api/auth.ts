import apiClient from "./client";
import { LoginRequest, LoginResponse, User } from "@/src/types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/login",
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/logout");
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ accessToken: string }>("/refresh", {
      refreshToken,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/me");
    return response.data;
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${userId}`, data);
    return response.data;
  },
};
