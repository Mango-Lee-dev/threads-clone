import { Post } from "@/app/types";
import { usePathname } from "expo-router";
import { useCallback, useContext, useRef, useState } from "react";
import { View, StyleSheet, useColorScheme, PanResponder } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimationContext } from "./_layout";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import Posts from "@/app/modules/post/ui/posts";

export default function Index() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const path = usePathname();
  const [posts, setPosts] = useState<Post[]>([]);
  const scrollPosition = useSharedValue(0);
  const isReadyToRefresh = useSharedValue(false);
  const { pullDownPosition } = useContext(AnimationContext);

  const onEndReached = useCallback(() => {
    fetch(
      `${Constants.expoConfig?.extra?.apiUrl}/posts?cursor=${posts.at(-1)?.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.posts.length > 0) {
          setPosts((prev) => [...prev, ...data.posts]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [posts]);

  const onRefresh = (done: () => void) => {
    setPosts([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetch(`${Constants.expoConfig?.extra?.apiUrl}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        done();
      });
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
      console.log("onScroll", event.contentOffset.y);
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
        renderItem={({ item }) => (
          <Posts key={item.id} item={item} />
        )}
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
