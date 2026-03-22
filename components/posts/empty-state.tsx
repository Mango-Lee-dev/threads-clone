import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

type EmptyStateType = "threads" | "replies" | "reposts";

interface EmptyStateProps {
  type: EmptyStateType;
  isOwnProfile?: boolean;
}

const config: Record<EmptyStateType, { icon: keyof typeof Ionicons.glyphMap; title: string; ownMessage: string; otherMessage: string }> = {
  threads: {
    icon: "document-text-outline",
    title: "스레드 없음",
    ownMessage: "첫 번째 스레드를 작성해보세요!",
    otherMessage: "아직 작성한 스레드가 없습니다.",
  },
  replies: {
    icon: "chatbubbles-outline",
    title: "답글 없음",
    ownMessage: "다른 스레드에 답글을 남겨보세요!",
    otherMessage: "아직 작성한 답글이 없습니다.",
  },
  reposts: {
    icon: "repeat-outline",
    title: "리포스트 없음",
    ownMessage: "마음에 드는 스레드를 리포스트해보세요!",
    otherMessage: "아직 리포스트가 없습니다.",
  },
};

export function EmptyState({ type, isOwnProfile = false }: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { icon, title, ownMessage, otherMessage } = config[type];

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={48}
        color={isDark ? "#555" : "#aaa"}
        style={styles.icon}
      />
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
        {title}
      </Text>
      <Text style={[styles.message, isDark ? styles.messageDark : styles.messageLight]}>
        {isOwnProfile ? ownMessage : otherMessage}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  titleLight: {
    color: "#333",
  },
  titleDark: {
    color: "#ddd",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  messageLight: {
    color: "#666",
  },
  messageDark: {
    color: "#888",
  },
});
