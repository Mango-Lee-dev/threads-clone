import { AuthContext } from "@/app/_layout";
import { PostItem } from "@/components/posts/post-item";
import { EmptyState } from "@/components/posts/empty-state";
import { PostSkeleton } from "@/components/posts/post-skeleton";
import { useUserPosts } from "@/src/features/profile";
import { Post } from "@/src/types";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useCallback, useContext, useMemo } from "react";
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
  } = useUserPosts(userId ?? "");

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.posts) ?? [];
  }, [data]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
