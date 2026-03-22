export const profileKeys = {
  all: ["profile"] as const,
  user: (userId: string) => [...profileKeys.all, userId] as const,
  posts: (userId: string) => [...profileKeys.user(userId), "posts"] as const,
  replies: (userId: string) => [...profileKeys.user(userId), "replies"] as const,
  reposts: (userId: string) => [...profileKeys.user(userId), "reposts"] as const,
};
