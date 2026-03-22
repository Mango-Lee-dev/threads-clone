import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

interface PostSkeletonProps {
  count?: number;
}

function SkeletonItem() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const skeletonColor = isDark ? "#333" : "#e0e0e0";

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Animated.View
          style={[
            styles.avatar,
            { backgroundColor: skeletonColor, opacity },
          ]}
        />
        <View
          style={[styles.threadLine, { backgroundColor: skeletonColor }]}
        />
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.userName,
              { backgroundColor: skeletonColor, opacity },
            ]}
          />
          <Animated.View
            style={[
              styles.timeAgo,
              { backgroundColor: skeletonColor, opacity },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.contentLine,
            { backgroundColor: skeletonColor, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.contentLine,
            styles.contentLineShort,
            { backgroundColor: skeletonColor, opacity },
          ]}
        />

        <View style={styles.actions}>
          {[1, 2, 3, 4].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.actionButton,
                { backgroundColor: skeletonColor, opacity },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export function PostSkeleton({ count = 3 }: PostSkeletonProps) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  leftColumn: {
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  threadLine: {
    width: 2,
    height: 40,
    marginTop: 8,
    borderRadius: 1,
  },
  rightColumn: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userName: {
    width: 100,
    height: 14,
    borderRadius: 4,
  },
  timeAgo: {
    width: 40,
    height: 12,
    borderRadius: 4,
  },
  contentLine: {
    width: "100%",
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  contentLineShort: {
    width: "70%",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 24,
  },
});
