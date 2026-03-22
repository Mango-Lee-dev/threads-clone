import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/src/services/api";
import { userKeys } from "./keys";
import { UserProfile } from "@/src/types";

export function useMuteUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.muteUser(userId),
    onSuccess: () => {
      queryClient.setQueryData<UserProfile>(
        userKeys.profile(userId),
        (old) => old && { ...old, isMuted: true }
      );
    },
  });
}

export function useUnmuteUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.unmuteUser(userId),
    onSuccess: () => {
      queryClient.setQueryData<UserProfile>(
        userKeys.profile(userId),
        (old) => old && { ...old, isMuted: false }
      );
    },
  });
}

export function useBlockUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.blockUser(userId),
    onSuccess: () => {
      queryClient.setQueryData<UserProfile>(
        userKeys.profile(userId),
        (old) => old && { ...old, isBlocked: true, isFollowing: false }
      );
    },
  });
}

export function useUnblockUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.unblockUser(userId),
    onSuccess: () => {
      queryClient.setQueryData<UserProfile>(
        userKeys.profile(userId),
        (old) => old && { ...old, isBlocked: false }
      );
    },
  });
}

export function useRestrictUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.restrictUser(userId),
    onSuccess: () => {
      queryClient.setQueryData<UserProfile>(
        userKeys.profile(userId),
        (old) => old && { ...old, isRestricted: true }
      );
    },
  });
}

export function useUnrestrictUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.unrestrictUser(userId),
    onSuccess: () => {
      queryClient.setQueryData<UserProfile>(
        userKeys.profile(userId),
        (old) => old && { ...old, isRestricted: false }
      );
    },
  });
}
