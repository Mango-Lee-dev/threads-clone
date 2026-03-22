import apiClient from "./client";
import { Post, PostsResponse, RepliesResponse, RepostsResponse } from "@/src/types";

export interface CreatePostRequest {
  content: string;
  imageUrls?: string[];
  location?: [number, number];
}

export const postsApi = {
  getPosts: async (cursor?: string): Promise<PostsResponse> => {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get<PostsResponse>("/posts", { params });
    return response.data;
  },

  getFollowingPosts: async (cursor?: string): Promise<PostsResponse> => {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get<PostsResponse>("/posts/following", { params });
    return response.data;
  },

  getPost: async (postId: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<Post>("/posts", data);
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
  },

  likePost: async (postId: string): Promise<{ likes: number }> => {
    const response = await apiClient.post<{ likes: number }>(
      `/posts/${postId}/like`
    );
    return response.data;
  },

  unlikePost: async (postId: string): Promise<{ likes: number }> => {
    const response = await apiClient.delete<{ likes: number }>(
      `/posts/${postId}/like`
    );
    return response.data;
  },

  repost: async (postId: string): Promise<{ reposts: number }> => {
    const response = await apiClient.post<{ reposts: number }>(
      `/posts/${postId}/repost`
    );
    return response.data;
  },

  getUserPosts: async (userId: string, cursor?: string): Promise<PostsResponse> => {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get<PostsResponse>(
      `/users/${userId}/posts`,
      { params }
    );
    return response.data;
  },

  getUserReplies: async (userId: string, cursor?: string): Promise<RepliesResponse> => {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get<RepliesResponse>(
      `/users/${userId}/replies`,
      { params }
    );
    return response.data;
  },

  getUserReposts: async (userId: string, cursor?: string): Promise<RepostsResponse> => {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get<RepostsResponse>(
      `/users/${userId}/reposts`,
      { params }
    );
    return response.data;
  },
};
