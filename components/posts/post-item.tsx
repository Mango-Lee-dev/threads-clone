import { Post } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    router.push(`/@${post.user.id}/post/${post.id}`);
  };

  const handleProfilePress = () => {
    router.push(`/@${post.user.id}`);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.leftColumn}>
        <Pressable onPress={handleProfilePress}>
          <Image
            source={{ uri: post.user.profileImageUrl }}
            style={styles.avatar}
          />
        </Pressable>
        <View
          style={[styles.threadLine, isDark ? styles.threadLineDark : styles.threadLineLight]}
        />
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.header}>
          <Pressable onPress={handleProfilePress} style={styles.userInfo}>
            <Text style={[styles.userName, isDark ? styles.textDark : styles.textLight]}>
              {post.user.name}
            </Text>
            {post.user.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#0095F6"
                style={styles.verifiedBadge}
              />
            )}
          </Pressable>
          <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        </View>

        <Text style={[styles.content, isDark ? styles.textDark : styles.textLight]}>
          {post.content}
        </Text>

        {post.imageUrls && post.imageUrls.length > 0 && (
          <View style={styles.imageContainer}>
            {post.imageUrls.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={[
                  styles.postImage,
                  post.imageUrls!.length === 1 && styles.singleImage,
                ]}
                contentFit="cover"
              />
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Ionicons
              name="heart-outline"
              size={20}
              color={isDark ? "#888" : "#666"}
            />
            {post.likes > 0 && (
              <Text style={styles.actionText}>{post.likes}</Text>
            )}
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={isDark ? "#888" : "#666"}
            />
            {post.comments > 0 && (
              <Text style={styles.actionText}>{post.comments}</Text>
            )}
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Ionicons
              name="repeat-outline"
              size={20}
              color={isDark ? "#888" : "#666"}
            />
            {post.reposts > 0 && (
              <Text style={styles.actionText}>{post.reposts}</Text>
            )}
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Ionicons
              name="paper-plane-outline"
              size={18}
              color={isDark ? "#888" : "#666"}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
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
    flex: 1,
    marginTop: 8,
    borderRadius: 1,
  },
  threadLineLight: {
    backgroundColor: "#ddd",
  },
  threadLineDark: {
    backgroundColor: "#333",
  },
  rightColumn: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: 14,
    color: "#888",
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  textLight: {
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  postImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  singleImage: {
    width: "100%",
    height: 200,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    color: "#888",
    marginLeft: 4,
  },
});
