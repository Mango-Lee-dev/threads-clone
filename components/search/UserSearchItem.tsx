import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { UserProfile } from "@/src/types";
import { usersApi } from "@/src/services/api";

interface UserSearchItemProps {
  user: UserProfile;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
}

function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export default function UserSearchItem({
  user,
  onFollowChange,
}: UserSearchItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    router.push(`/${user.id}`);
  };

  const handleFollowPress = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        await usersApi.unfollowUser(user.id);
        setIsFollowing(false);
        onFollowChange?.(user.id, false);
      } else {
        await usersApi.followUser(user.id);
        setIsFollowing(true);
        onFollowChange?.(user.id, true);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <Image
        source={{ uri: user.profileImageUrl }}
        style={styles.profileImage}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, isDark ? styles.textDark : styles.textLight]}
            numberOfLines={1}
          >
            {user.name}
          </Text>
          {user.isVerified && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#0095F6"
              style={styles.verifiedBadge}
            />
          )}
        </View>

        <Text
          style={[styles.username, isDark ? styles.usernameText : styles.usernameTextLight]}
          numberOfLines={1}
        >
          @{user.id}
        </Text>

        <Text
          style={[styles.followers, isDark ? styles.textDark : styles.textLight]}
        >
          {formatFollowerCount(user.followersCount)} followers
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.followButton,
          isFollowing
            ? isDark
              ? styles.followingButtonDark
              : styles.followingButtonLight
            : isDark
            ? styles.followButtonDark
            : styles.followButtonLight,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleFollowPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={isFollowing ? (isDark ? "#fff" : "#000") : "#fff"}
          />
        ) : (
          <Text
            style={[
              styles.followButtonText,
              isFollowing
                ? isDark
                  ? styles.followingTextDark
                  : styles.followingTextLight
                : styles.followText,
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  pressed: {
    opacity: 0.7,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  textLight: {
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  username: {
    fontSize: 14,
    marginTop: 1,
  },
  usernameText: {
    color: "#888",
  },
  usernameTextLight: {
    color: "#666",
  },
  followers: {
    fontSize: 14,
    marginTop: 4,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  followButtonLight: {
    backgroundColor: "#000",
  },
  followButtonDark: {
    backgroundColor: "#fff",
  },
  followingButtonLight: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  followingButtonDark: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#444",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  followText: {
    color: "#fff",
  },
  followingTextLight: {
    color: "#000",
  },
  followingTextDark: {
    color: "#fff",
  },
});
