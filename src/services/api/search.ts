import apiClient from "./client";
import { UserProfile } from "@/src/types";

export const searchApi = {
  searchUsers: async (query: string): Promise<UserProfile[]> => {
    const response = await apiClient.get<UserProfile[]>("/users/search", {
      params: { q: query },
    });
    return response.data;
  },

  getSuggestions: async (): Promise<UserProfile[]> => {
    const response = await apiClient.get<UserProfile[]>("/users/suggestions");
    return response.data;
  },
};
