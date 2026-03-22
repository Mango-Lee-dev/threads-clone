import { AuthContext } from "@/app/_layout";
import { ReplyItem } from "@/components/posts/reply-item";
import { EmptyState } from "@/components/posts/empty-state";
import { PostSkeleton } from "@/components/posts/post-skeleton";
import { useUserReplies } from "@/src/features/profile";
import { Reply } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useMemo } from "react";
import {
  RefreshControl,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";
import { FlashList } from "@shopify/flash-list";

export default function RepliesTab() {
  const colorScheme = useColorScheme();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { user } = useContext(AuthContext);

  const userId = username?.startsWith("@") ? username.slice(1) : username;
  const isOwnProfile = user?.id === userId;

  const {
    data,
    isLoading,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useUserReplies(userId ?? "");

  const replies = useMemo(() => {
    return data?.pages.flatMap((page) => page.replies) ?? [];
  }, [data]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(({ item }: { item: Reply }) => (
    <ReplyItem reply={item} />
  ), []);

  const renderEmpty = useCallback(() => {
    if (isLoading) return <PostSkeleton count={3} />;
    return <EmptyState type="replies" isOwnProfile={isOwnProfile} />;
  }, [isLoading, isOwnProfile]);

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <FlashList
        data={replies}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colorScheme === "dark" ? "#fff" : "#000"}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  containerLight: {
    backgroundColor: "white",
  },
});
