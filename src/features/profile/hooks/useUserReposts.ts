import { useInfiniteQuery } from "@tanstack/react-query";
import { postsApi } from "@/src/services/api";
import { profileKeys } from "./keys";

export function useUserReposts(userId: string) {
  return useInfiniteQuery({
    queryKey: profileKeys.reposts(userId),
    queryFn: async ({ pageParam }) => {
      const data = await postsApi.getUserReposts(userId, pageParam);
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
  });
}
