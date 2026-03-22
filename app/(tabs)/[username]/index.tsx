import { AuthContext } from "@/app/_layout";
import { PostItem } from "@/components/posts/post-item";
import { EmptyState } from "@/components/posts/empty-state";
import { PostSkeleton } from "@/components/posts/post-skeleton";
import { postsApi } from "@/src/services/api/posts";
import { Post } from "@/src/types";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  Text,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";

function Header() {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  const isOwnProfile = pathname === "/@" + user?.id;

  if (!isOwnProfile) return null;

  return (
    <View style={styles.postInputContainer}>
      <Image
        source={{ uri: user?.profileImageUrl }}
        style={styles.profileAvatar}
      />
      <Text
        style={
          colorScheme === "dark"
            ? styles.postInputTextDark
            : styles.postInputTextLight
        }
      >
        What's new?
      </Text>
      <Pressable
        onPress={() => router.navigate("/modal")}
        style={[
          styles.postButton,
          colorScheme === "dark" ? styles.postButtonDark : styles.postButtonLight,
        ]}
      >
        <Text
          style={[
            styles.postButtonText,
            colorScheme === "dark"
              ? styles.postButtonTextDark
              : styles.postButtonTextLight,
          ]}
        >
          Post
        </Text>
      </Pressable>
    </View>
  );
}

export default function ThreadsTab() {
  const colorScheme = useColorScheme();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const userId = username?.startsWith("@") ? username.slice(1) : username;
  const isOwnProfile = user?.id === userId;

  const fetchPosts = useCallback(async (refresh = false) => {
    if (!userId) return;

    try {
      if (refresh) {
        setIsRefreshing(true);
      }

      const response = await postsApi.getUserPosts(
        userId,
        refresh ? undefined : cursor
      );

      if (refresh) {
        setPosts(response.posts);
      } else {
        setPosts((prev) => [...prev, ...response.posts]);
      }

      setCursor(response.nextCursor);
      setHasMore(!!response.nextCursor);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, cursor]);

  useEffect(() => {
    fetchPosts(true);
  }, [userId]);

  const handleRefresh = useCallback(() => {
    setCursor(undefined);
    fetchPosts(true);
  }, [fetchPosts]);

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore && !isRefreshing) {
      fetchPosts(false);
    }
  }, [isLoading, hasMore, isRefreshing, fetchPosts]);

  const renderItem = useCallback(({ item }: { item: Post }) => (
    <PostItem post={item} />
  ), []);

  const renderEmpty = useCallback(() => {
    if (isLoading) return <PostSkeleton count={3} />;
    return <EmptyState type="threads" isOwnProfile={isOwnProfile} />;
  }, [isLoading, isOwnProfile]);

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <FlashList
        data={posts}
        renderItem={renderItem}
        ListHeaderComponent={<Header />}
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
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#aaa",
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 22,
    position: "absolute",
    right: 16,
  },
  postButtonLight: {
    backgroundColor: "black",
  },
  postButtonDark: {
    backgroundColor: "white",
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },
  postButtonTextLight: {
    color: "white",
  },
  postButtonTextDark: {
    color: "black",
  },
  postInputTextLight: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  postInputTextDark: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },
});
