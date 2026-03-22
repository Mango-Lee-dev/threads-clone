import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "@/src/types";

interface ProfileHeaderProps {
  profile: UserProfile;
  onFollowersPress?: () => void;
}

export function ProfileHeader({ profile, onFollowersPress }: ProfileHeaderProps) {
  const isDark = useColorScheme() === "dark";

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, isDark && styles.nameDark]}>
            {profile.name}
          </Text>
          {profile.isVerified && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#0095F6"
              style={styles.verifiedBadge}
            />
          )}
        </View>

        <View style={styles.usernameRow}>
          <Text style={[styles.username, isDark && styles.usernameDark]}>
            {profile.id}
          </Text>
          {profile.showInstagramBadge && (
            <View style={[styles.instagramBadge, isDark && styles.instagramBadgeDark]}>
              <Text style={styles.instagramBadgeText}>threads.net</Text>
            </View>
          )}
        </View>

        {profile.description ? (
          <Text style={[styles.description, isDark && styles.descriptionDark]}>
            {profile.description}
          </Text>
        ) : null}

        {profile.link ? (
          <Text style={styles.link}>{profile.link}</Text>
        ) : null}

        <Pressable onPress={onFollowersPress} style={styles.followersContainer}>
          <Text style={[styles.followersText, isDark && styles.followersTextDark]}>
            {formatCount(profile.followersCount)} followers
          </Text>
        </Pressable>
      </View>

      <Image
        source={{ uri: profile.profileImageUrl }}
        style={styles.avatar}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  nameDark: {
    color: "#fff",
  },
  verifiedBadge: {
    marginLeft: 6,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  username: {
    fontSize: 15,
    color: "#000",
  },
  usernameDark: {
    color: "#fff",
  },
  instagramBadge: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  instagramBadgeDark: {
    backgroundColor: "#333",
  },
  instagramBadgeText: {
    fontSize: 11,
    color: "#666",
  },
  description: {
    fontSize: 15,
    color: "#000",
    marginTop: 12,
    lineHeight: 20,
  },
  descriptionDark: {
    color: "#fff",
  },
  link: {
    fontSize: 15,
    color: "#0095F6",
    marginTop: 4,
  },
  followersContainer: {
    marginTop: 12,
  },
  followersText: {
    fontSize: 15,
    color: "#666",
  },
  followersTextDark: {
    color: "#888",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ddd",
  },
});
