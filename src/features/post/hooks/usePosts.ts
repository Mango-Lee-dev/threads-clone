import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/src/services/api";
import { Post } from "@/src/types";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters?: string) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

export function usePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: async ({ pageParam }) => {
      const data = await postsApi.getPosts(pageParam);
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.posts.length === 0) return undefined;
      return lastPage.posts.at(-1)?.id;
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsApi.likePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      const previousData = queryClient.getQueryData(postKeys.lists());

      queryClient.setQueryData(postKeys.lists(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: Post) =>
              post.id === postId ? { ...post, likes: post.likes + 1 } : post
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, postId, context) => {
      queryClient.setQueryData(postKeys.lists(), context?.previousData);
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
