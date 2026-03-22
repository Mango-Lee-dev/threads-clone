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

// Post 작성자 타입
export interface PostUser {
  id: string;
  name: string;
  profileImageUrl: string;
  isVerified?: boolean;
}

// Post 관련 타입
export interface Post {
  id: string;
  user: PostUser;
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

// Reply 타입 (답글)
export interface Reply {
  id: string;
  type: "reply";
  user: PostUser;
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  reposts: number;
  imageUrls?: string[];
  parentPost: {
    id: string;
    user: PostUser;
    content: string; // 미리보기용 (truncated)
  };
}

// Repost 타입 (리포스트)
export interface Repost {
  id: string;
  type: "repost";
  user: PostUser;
  repostedAt: string;
  originalPost: Post;
  quoteContent?: string; // 인용 리포스트인 경우
}

// 프로필 탭에서 사용할 통합 타입
export type ProfilePost = Post | Reply | Repost;

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PostsResponse {
  posts: Post[];
  nextCursor?: string;
}

export interface RepliesResponse {
  replies: Reply[];
  nextCursor?: string;
}

export interface RepostsResponse {
  reposts: Repost[];
  nextCursor?: string;
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
