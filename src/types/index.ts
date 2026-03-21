// User 관련 타입
export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
  link?: string;
  showInstagramBadge?: boolean;
  isPrivate?: boolean;
}

// Post 관련 타입
export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    profileImageUrl: string;
    isVerified?: boolean;
  };
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  reposts: number;
  imageUrls?: string[];
  link?: string;
  linkThumbnail?: string;
  location?: [number, number];
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PostsResponse {
  posts: Post[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}
