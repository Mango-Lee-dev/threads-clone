import apiClient from "./client";
import { UserProfile, UserActionResponse } from "@/src/types";

export const usersApi = {
  getUser: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(`/users/${userId}`);
    return response.data;
  },

  followUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await apiClient.post<UserActionResponse>(
      `/users/${userId}/follow`
    );
    return response.data;
  },

  unfollowUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await apiClient.delete<UserActionResponse>(
      `/users/${userId}/follow`
    );
    return response.data;
  },

  muteUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await apiClient.post<UserActionResponse>(
      `/users/${userId}/mute`
    );
    return response.data;
  },

  unmuteUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await apiClient.delete<UserActionResponse>(
      `/users/${userId}/mute`
    );
    return response.data;
  },

  blockUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await apiClient.post<UserActionResponse>(
      `/users/${userId}/block`
    );
    return response.data;
  },

  unblockUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await apiClient.delete<UserActionResponse>(
      `/users/${userId}/block`
    );
    return response.data;
  },

  restrictUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await apiClient.post<UserActionResponse>(
      `/users/${userId}/restrict`
    );
    return response.data;
  },

  unrestrictUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await apiClient.delete<UserActionResponse>(
      `/users/${userId}/restrict`
    );
    return response.data;
  },
};
