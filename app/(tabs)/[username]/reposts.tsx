import { AuthContext } from "@/app/_layout";
import { RepostItem } from "@/components/posts/repost-item";
import { EmptyState } from "@/components/posts/empty-state";
import { PostSkeleton } from "@/components/posts/post-skeleton";
import { postsApi } from "@/src/services/api/posts";
import { Repost } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";
import { FlashList } from "@shopify/flash-list";

export default function RepostsTab() {
  const colorScheme = useColorScheme();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { user } = useContext(AuthContext);

  const [reposts, setReposts] = useState<Repost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const userId = username?.startsWith("@") ? username.slice(1) : username;
  const isOwnProfile = user?.id === userId;

  const fetchReposts = useCallback(async (refresh = false) => {
    if (!userId) return;

    try {
      if (refresh) {
        setIsRefreshing(true);
      }

      const response = await postsApi.getUserReposts(
        userId,
        refresh ? undefined : cursor
      );

      if (refresh) {
        setReposts(response.reposts);
      } else {
        setReposts((prev) => [...prev, ...response.reposts]);
      }

      setCursor(response.nextCursor);
      setHasMore(!!response.nextCursor);
    } catch (error) {
      console.error("Failed to fetch reposts:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, cursor]);

  useEffect(() => {
    fetchReposts(true);
  }, [userId]);

  const handleRefresh = useCallback(() => {
    setCursor(undefined);
    fetchReposts(true);
  }, [fetchReposts]);

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore && !isRefreshing) {
      fetchReposts(false);
    }
  }, [isLoading, hasMore, isRefreshing, fetchReposts]);

  const renderItem = useCallback(({ item }: { item: Repost }) => (
    <RepostItem repost={item} />
  ), []);

  const renderEmpty = useCallback(() => {
    if (isLoading) return <PostSkeleton count={3} />;
    return <EmptyState type="reposts" isOwnProfile={isOwnProfile} />;
  }, [isLoading, isOwnProfile]);

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <FlashList
        data={reposts}
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
