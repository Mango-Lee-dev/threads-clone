import { Reply } from "@/src/types";
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

interface ReplyItemProps {
  reply: Reply;
}

export function ReplyItem({ reply }: ReplyItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleParentPress = () => {
    router.push(`/@${reply.parentPost.user.id}/post/${reply.parentPost.id}`);
  };

  const handleReplyPress = () => {
    router.push(`/@${reply.user.id}/post/${reply.id}`);
  };

  const handleProfilePress = (userId: string) => {
    router.push(`/@${userId}`);
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* 원본 포스트 (축약) */}
      <Pressable onPress={handleParentPress} style={styles.parentContainer}>
        <View style={styles.parentLeft}>
          <Pressable onPress={() => handleProfilePress(reply.parentPost.user.id)}>
            <Image
              source={{ uri: reply.parentPost.user.profileImageUrl }}
              style={styles.parentAvatar}
            />
          </Pressable>
          <View style={[styles.connectLine, isDark ? styles.connectLineDark : styles.connectLineLight]} />
        </View>
        <View style={styles.parentRight}>
          <View style={styles.parentHeader}>
            <Text style={[styles.parentUserName, isDark ? styles.textDark : styles.textLight]}>
              {reply.parentPost.user.name}
            </Text>
            {reply.parentPost.user.isVerified && (
              <Ionicons name="checkmark-circle" size={12} color="#0095F6" />
            )}
          </View>
          <Text
            style={[styles.parentContent, isDark ? styles.textMutedDark : styles.textMutedLight]}
            numberOfLines={2}
          >
            {reply.parentPost.content}
          </Text>
        </View>
      </Pressable>

      {/* 답글 */}
      <Pressable onPress={handleReplyPress} style={styles.replyContainer}>
        <View style={styles.replyLeft}>
          <Pressable onPress={() => handleProfilePress(reply.user.id)}>
            <Image
              source={{ uri: reply.user.profileImageUrl }}
              style={styles.avatar}
            />
          </Pressable>
        </View>

        <View style={styles.replyRight}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, isDark ? styles.textDark : styles.textLight]}>
                {reply.user.name}
              </Text>
              {reply.user.isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#0095F6"
                  style={styles.verifiedBadge}
                />
              )}
            </View>
            <Text style={styles.timeAgo}>{reply.timeAgo}</Text>
          </View>

          <Text style={[styles.content, isDark ? styles.textDark : styles.textLight]}>
            {reply.content}
          </Text>

          {reply.imageUrls && reply.imageUrls.length > 0 && (
            <View style={styles.imageContainer}>
              {reply.imageUrls.map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={styles.replyImage}
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
              {reply.likes > 0 && (
                <Text style={styles.actionText}>{reply.likes}</Text>
              )}
            </Pressable>

            <Pressable style={styles.actionButton}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={isDark ? "#888" : "#666"}
              />
              {reply.comments > 0 && (
                <Text style={styles.actionText}>{reply.comments}</Text>
              )}
            </Pressable>

            <Pressable style={styles.actionButton}>
              <Ionicons
                name="repeat-outline"
                size={20}
                color={isDark ? "#888" : "#666"}
              />
              {reply.reposts > 0 && (
                <Text style={styles.actionText}>{reply.reposts}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerLight: {
    borderBottomColor: "#ddd",
  },
  containerDark: {
    borderBottomColor: "#333",
  },
  parentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  parentLeft: {
    alignItems: "center",
    marginRight: 12,
  },
  parentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  connectLine: {
    width: 2,
    height: 24,
    marginTop: 4,
    borderRadius: 1,
  },
  connectLineLight: {
    backgroundColor: "#ddd",
  },
  connectLineDark: {
    backgroundColor: "#333",
  },
  parentRight: {
    flex: 1,
  },
  parentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  parentUserName: {
    fontSize: 14,
    fontWeight: "500",
  },
  parentContent: {
    fontSize: 14,
    lineHeight: 18,
  },
  replyContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  replyLeft: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  replyRight: {
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
  textMutedLight: {
    color: "#555",
  },
  textMutedDark: {
    color: "#aaa",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  replyImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
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
