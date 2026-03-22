import { usePosts } from "@/src/features/post";
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

export default function Index() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const scrollPosition = useSharedValue(0);
  const scrollPositionRef = useRef(0); // PanResponder용 일반 ref
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
    isRefetching,
  } = usePosts();

  // 모든 페이지의 posts를 평탄화하고, 본인 게시물 제외
  const posts = useMemo(() => {
    const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];
    // 본인 게시물 필터링
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
        isReadyToRefresh.value = false; // 초기화
      });
    }
  };

  const panResponderRef = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 스크롤이 최상단이고, 아래로 드래그할 때만 PanResponder 활성화
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
      transform: [
        {
          translateY: pullDownPosition.value,
        },
      ],
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
          style={
            colorScheme === "dark"
              ? styles.textDefaultDark
              : styles.textDefaultLight
          }
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
  textDefaultDark: {
    color: "white",
  },
  textDefaultLight: {
    color: "black",
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
});
