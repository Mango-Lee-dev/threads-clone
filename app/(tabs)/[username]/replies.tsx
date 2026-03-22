import { AuthContext } from "@/app/_layout";
import { ReplyItem } from "@/components/posts/reply-item";
import { EmptyState } from "@/components/posts/empty-state";
import { PostSkeleton } from "@/components/posts/post-skeleton";
import { postsApi } from "@/src/services/api/posts";
import { Reply } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
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

  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const userId = username?.startsWith("@") ? username.slice(1) : username;
  const isOwnProfile = user?.id === userId;

  const fetchReplies = useCallback(async (refresh = false) => {
    if (!userId) return;

    try {
      if (refresh) {
        setIsRefreshing(true);
      }

      const response = await postsApi.getUserReplies(
        userId,
        refresh ? undefined : cursor
      );

      if (refresh) {
        setReplies(response.replies);
      } else {
        setReplies((prev) => [...prev, ...response.replies]);
      }

      setCursor(response.nextCursor);
      setHasMore(!!response.nextCursor);
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, cursor]);

  useEffect(() => {
    fetchReplies(true);
  }, [userId]);

  const handleRefresh = useCallback(() => {
    setCursor(undefined);
    fetchReplies(true);
  }, [fetchReplies]);

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore && !isRefreshing) {
      fetchReplies(false);
    }
  }, [isLoading, hasMore, isRefreshing, fetchReplies]);

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
            refreshing={isRefreshing}
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
