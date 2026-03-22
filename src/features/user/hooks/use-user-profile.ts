import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/src/services/api";
import { userKeys } from "./keys";

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
  });
}
