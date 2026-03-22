import { View, Text, Pressable, StyleSheet, useColorScheme, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "@/src/types";
import { useFollowUser, useUnfollowUser } from "@/src/features/user";

interface OtherProfileActionsProps {
  profile: UserProfile;
  onMentionPress?: () => void;
  onMorePress?: () => void;
}

export function OtherProfileActions({
  profile,
  onMentionPress,
  onMorePress,
}: OtherProfileActionsProps) {
  const isDark = useColorScheme() === "dark";
  const followMutation = useFollowUser(profile.id);
  const unfollowMutation = useUnfollowUser(profile.id);

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  const handleFollowPress = () => {
    if (profile.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const getFollowButtonStyle = () => {
    if (profile.isFollowing) {
      return [styles.followButton, styles.followingButton, isDark && styles.followingButtonDark];
    }
    return [styles.followButton, styles.notFollowingButton];
  };

  const getFollowButtonTextStyle = () => {
    if (profile.isFollowing) {
      return [styles.followButtonText, isDark && styles.followingButtonTextDark];
    }
    return [styles.followButtonText, styles.notFollowingButtonText];
  };

  const getFollowButtonText = () => {
    if (profile.isFollowing) {
      return "Following";
    }
    if (profile.isFollowedBy) {
      return "Follow back";
    }
    return "Follow";
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={getFollowButtonStyle()}
        onPress={handleFollowPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={profile.isFollowing ? "#000" : "#fff"} />
        ) : (
          <Text style={getFollowButtonTextStyle()}>
            {getFollowButtonText()}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.iconButton, isDark && styles.iconButtonDark]}
        onPress={onMentionPress}
      >
        <Ionicons name="at" size={20} color={isDark ? "#fff" : "#000"} />
      </Pressable>

      <Pressable
        style={[styles.iconButton, isDark && styles.iconButtonDark]}
        onPress={onMorePress}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={isDark ? "#fff" : "#000"} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  followButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notFollowingButton: {
    backgroundColor: "#000",
  },
  followingButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  followingButtonDark: {
    backgroundColor: "#1c1c1c",
    borderColor: "#333",
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  notFollowingButtonText: {
    color: "#fff",
  },
  followingButtonTextDark: {
    color: "#fff",
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonDark: {
    backgroundColor: "#1c1c1c",
    borderColor: "#333",
  },
});
