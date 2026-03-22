import { useInfiniteQuery } from "@tanstack/react-query";
import { postsApi } from "@/src/services/api";
import { profileKeys } from "./keys";

export function useUserPosts(userId: string) {
  return useInfiniteQuery({
    queryKey: profileKeys.posts(userId),
    queryFn: async ({ pageParam }) => {
      const data = await postsApi.getUserPosts(userId, pageParam);
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
  });
}
