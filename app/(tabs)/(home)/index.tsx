import { Post } from "@/src/types";
import { postsApi } from "@/src/services/api";
import { useCallback, useContext, useRef, useState } from "react";
import { View, StyleSheet, useColorScheme, PanResponder } from "react-native";
import Animated, {
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollPosition = useSharedValue(0);
  const isReadyToRefresh = useSharedValue(false);
  const { pullDownPosition } = useContext(AnimationContext);

  const onEndReached = useCallback(async () => {
    if (isLoading || posts.length === 0) return;

    const lastPostId = posts.at(-1)?.id;
    if (!lastPostId) return;

    setIsLoading(true);
    try {
      const data = await postsApi.getPosts(lastPostId);
      if (data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, posts]);

  const onRefresh = async (done: () => void) => {
    setPosts([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const data = await postsApi.getPosts();
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to refresh posts:", error);
    } finally {
      done();
    }
  };

  const onPanRelease = () => {
    pullDownPosition.value = withTiming(isReadyToRefresh.value ? 60 : 0, {
      duration: 300,
    });
    if (isReadyToRefresh.value) {
      onRefresh(() => {
        pullDownPosition.value = withTiming(0, {
          duration: 300,
        });
      });
    }
  };

  const panResponderRef = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const max = 120;
        pullDownPosition.value = Math.max(Math.min(gestureState.dy, max), 0);
        console.log("pull", pullDownPosition.value);

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
    }),
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollPosition.value = event.contentOffset.y;
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
        renderItem={({ item }) => <PostItem key={item.id} item={item} />}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
  },
  header: {
    alignItems: "center",
  },
  headerLogo: {
    width: 42,
    height: 42,
  },
  loginButton: {
    position: "absolute",
    right: 20,
    top: 0,
    borderWidth: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "white",
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
