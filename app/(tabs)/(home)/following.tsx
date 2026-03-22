import { useFollowingPosts } from "@/src/features/post";
import { useCallback, useContext, useMemo, useRef } from "react";
import { AuthContext } from "@/app/_layout";
import {
  View,
  StyleSheet,
  useColorScheme,
  PanResponder,
  ActivityIndicator,
  Text,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimationContext } from "./_layout";
import * as Haptics from "expo-haptics";
import PostItem from "@/app/modules/post/ui/posts";

export default function Following() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const scrollPosition = useSharedValue(0);
  const scrollPositionRef = useRef(0);
  const isReadyToRefresh = useSharedValue(false);
  const { pullDownPosition } = useContext(AnimationContext);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFollowingPosts();

  // 모든 페이지의 posts를 평탄화하고, 본인 게시물 제외
  const posts = useMemo(() => {
    const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];
    return user ? allPosts.filter((post) => post.user.id !== user.id) : allPosts;
  }, [data, user]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onRefresh = useCallback(
    async (done: () => void) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await refetch();
      done();
    },
    [refetch]
  );

  const onPanRelease = () => {
    const shouldRefresh = isReadyToRefresh.value;
    pullDownPosition.value = withTiming(shouldRefresh ? 60 : 0, {
      duration: 300,
    });
    if (shouldRefresh) {
      onRefresh(() => {
        pullDownPosition.value = withTiming(0, {
          duration: 300,
        });
        isReadyToRefresh.value = false;
      });
    }
  };

  const panResponderRef = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return scrollPositionRef.current <= 0 && gestureState.dy > 0;
      },
      onPanResponderMove: (event, gestureState) => {
        const max = 120;
        pullDownPosition.value = Math.max(Math.min(gestureState.dy, max), 0);

        if (
          pullDownPosition.value >= max / 2 &&
          isReadyToRefresh.value === false
        ) {
          isReadyToRefresh.value = true;
        }
        if (
          pullDownPosition.value < max / 2 &&
          isReadyToRefresh.value === true
        ) {
          isReadyToRefresh.value = false;
        }
      },
      onPanResponderRelease: onPanRelease,
      onPanResponderTerminate: onPanRelease,
    })
  );

  const updateScrollRef = (y: number) => {
    scrollPositionRef.current = y;
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollPosition.value = event.contentOffset.y;
      runOnJS(updateScrollRef)(event.contentOffset.y);
    },
  });

  const pullDownStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: pullDownPosition.value }],
    };
  });

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.emptyText,
            colorScheme === "dark" ? styles.textDark : styles.textLight,
          ]}
        >
          팔로우한 사용자의 게시물이 없습니다.
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          colorScheme === "dark" ? styles.containerDark : styles.containerLight,
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          colorScheme === "dark" ? styles.containerDark : styles.containerLight,
        ]}
      >
        <Text
          style={colorScheme === "dark" ? styles.textDark : styles.textLight}
        >
          오류가 발생했습니다: {(error as Error)?.message}
        </Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
        pullDownStyles,
      ]}
      {...panResponderRef.current?.panHandlers}
    >
      <Animated.FlatList
        refreshControl={<View />}
        data={posts}
        nestedScrollEnabled={true}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item }) => <PostItem item={item} />}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
  },
  textDark: {
    color: "white",
  },
  textLight: {
    color: "black",
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
});
