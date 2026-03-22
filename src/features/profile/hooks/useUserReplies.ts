import { useInfiniteQuery } from "@tanstack/react-query";
import { postsApi } from "@/src/services/api";
import { profileKeys } from "./keys";

export function useUserReplies(userId: string) {
  return useInfiniteQuery({
    queryKey: profileKeys.replies(userId),
    queryFn: async ({ pageParam }) => {
      const data = await postsApi.getUserReplies(userId, pageParam);
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
  });
}
