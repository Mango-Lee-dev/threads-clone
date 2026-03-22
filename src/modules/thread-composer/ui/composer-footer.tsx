import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { ReplyOption } from "@/src/types";

interface ComposerFooterProps {
  replyOption: ReplyOption;
  onReplyOptionPress: () => void;
  onPost: () => void;
  canPost: boolean;
  isPosting: boolean;
  bottomInset: number;
}

export function ComposerFooter({
  replyOption,
  onReplyOptionPress,
  onPost,
  canPost,
  isPosting,
  bottomInset,
}: ComposerFooterProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <View
      style={[
        styles.footer,
        isDark && styles.footerDark,
        { paddingBottom: bottomInset + 10 },
      ]}
    >
      <Pressable onPress={onReplyOptionPress}>
        <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
          {replyOption} can reply & quote
        </Text>
      </Pressable>
      <Pressable
        disabled={!canPost || isPosting}
        onPress={onPost}
        style={[
          styles.postButton,
          canPost && !isPosting && styles.postButtonActive,
          isDark && canPost && !isPosting && styles.postButtonActiveDark,
        ]}
      >
        <Text
          style={[
            styles.postButtonText,
            canPost && !isPosting && styles.postButtonTextActive,
          ]}
        >
          {isPosting ? "Posting..." : "Post"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  footerDark: {
    backgroundColor: "#101010",
  },
  footerText: {
    fontSize: 14,
    color: "#8e8e93",
  },
  footerTextDark: {
    color: "#555",
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
  },
  postButtonActive: {
    backgroundColor: "#000",
  },
  postButtonActiveDark: {
    backgroundColor: "#fff",
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#999",
  },
  postButtonTextActive: {
    color: "#fff",
  },
});
