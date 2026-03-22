import { Repost } from "@/src/types";
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

interface RepostItemProps {
  repost: Repost;
}

export function RepostItem({ repost }: RepostItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { originalPost } = repost;

  const handleOriginalPress = () => {
    router.push(`/@${originalPost.user.id}/post/${originalPost.id}`);
  };

  const handleProfilePress = (userId: string) => {
    router.push(`/@${userId}`);
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* 리포스트 헤더 */}
      <View style={styles.repostHeader}>
        <Ionicons name="repeat" size={14} color="#888" />
        <Pressable onPress={() => handleProfilePress(repost.user.id)}>
          <Text style={styles.repostText}>
            {repost.user.name}님이 리포스트함
          </Text>
        </Pressable>
        <Text style={styles.repostTime}> · {repost.repostedAt}</Text>
      </View>

      {/* 인용 내용 (있는 경우) */}
      {repost.quoteContent && (
        <View style={styles.quoteContainer}>
          <Pressable onPress={() => handleProfilePress(repost.user.id)} style={styles.quoteHeader}>
            <Image
              source={{ uri: repost.user.profileImageUrl }}
              style={styles.quoteAvatar}
            />
            <Text style={[styles.quoteUserName, isDark ? styles.textDark : styles.textLight]}>
              {repost.user.name}
            </Text>
            {repost.user.isVerified && (
              <Ionicons name="checkmark-circle" size={12} color="#0095F6" />
            )}
          </Pressable>
          <Text style={[styles.quoteContent, isDark ? styles.textDark : styles.textLight]}>
            {repost.quoteContent}
          </Text>
        </View>
      )}

      {/* 원본 포스트 카드 */}
      <Pressable
        onPress={handleOriginalPress}
        style={[styles.originalCard, isDark ? styles.originalCardDark : styles.originalCardLight]}
      >
        <View style={styles.originalHeader}>
          <Pressable
            onPress={() => handleProfilePress(originalPost.user.id)}
            style={styles.originalUserInfo}
          >
            <Image
              source={{ uri: originalPost.user.profileImageUrl }}
              style={styles.originalAvatar}
            />
            <Text style={[styles.originalUserName, isDark ? styles.textDark : styles.textLight]}>
              {originalPost.user.name}
            </Text>
            {originalPost.user.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#0095F6"
                style={styles.verifiedBadge}
              />
            )}
          </Pressable>
          <Text style={styles.originalTime}>{originalPost.timeAgo}</Text>
        </View>

        <Text style={[styles.originalContent, isDark ? styles.textDark : styles.textLight]}>
          {originalPost.content}
        </Text>

        {originalPost.imageUrls && originalPost.imageUrls.length > 0 && (
          <View style={styles.imageContainer}>
            {originalPost.imageUrls.slice(0, 2).map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={[
                  styles.originalImage,
                  originalPost.imageUrls!.length === 1 && styles.singleImage,
                ]}
                contentFit="cover"
              />
            ))}
            {originalPost.imageUrls.length > 2 && (
              <View style={styles.moreImages}>
                <Text style={styles.moreImagesText}>
                  +{originalPost.imageUrls.length - 2}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.originalStats}>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={14} color="#888" />
            <Text style={styles.statText}>{originalPost.likes}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={12} color="#888" />
            <Text style={styles.statText}>{originalPost.comments}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="repeat-outline" size={14} color="#888" />
            <Text style={styles.statText}>{originalPost.reposts}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerLight: {
    borderBottomColor: "#ddd",
  },
  containerDark: {
    borderBottomColor: "#333",
  },
  repostHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 4,
  },
  repostText: {
    fontSize: 13,
    color: "#888",
    marginLeft: 6,
    fontWeight: "500",
  },
  repostTime: {
    fontSize: 13,
    color: "#888",
  },
  quoteContainer: {
    marginBottom: 12,
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  quoteAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  quoteUserName: {
    fontSize: 14,
    fontWeight: "600",
  },
  quoteContent: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 30,
  },
  originalCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  originalCardLight: {
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  originalCardDark: {
    borderColor: "#333",
    backgroundColor: "#1a1a1a",
  },
  originalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  originalUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  originalUserName: {
    fontSize: 14,
    fontWeight: "600",
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  originalTime: {
    fontSize: 13,
    color: "#888",
  },
  originalContent: {
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
    gap: 8,
    marginBottom: 8,
  },
  originalImage: {
    flex: 1,
    height: 120,
    borderRadius: 8,
  },
  singleImage: {
    height: 180,
  },
  moreImages: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  moreImagesText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  originalStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: "#888",
  },
});
