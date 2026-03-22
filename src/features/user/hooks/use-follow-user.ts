import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/src/services/api";
import { userKeys } from "./keys";
import { UserProfile } from "@/src/types";

export function useFollowUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.followUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKeys.profile(userId) });

      const previousProfile = queryClient.getQueryData<UserProfile>(
        userKeys.profile(userId)
      );

      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(userKeys.profile(userId), {
          ...previousProfile,
          isFollowing: true,
          followersCount: previousProfile.followersCount + 1,
        });
      }

      return { previousProfile };
    },
    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          userKeys.profile(userId),
          context.previousProfile
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
    },
  });
}

export function useUnfollowUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.unfollowUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKeys.profile(userId) });

      const previousProfile = queryClient.getQueryData<UserProfile>(
        userKeys.profile(userId)
      );

      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(userKeys.profile(userId), {
          ...previousProfile,
          isFollowing: false,
          followersCount: Math.max(0, previousProfile.followersCount - 1),
        });
      }

      return { previousProfile };
    },
    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          userKeys.profile(userId),
          context.previousProfile
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
    },
  });
}
