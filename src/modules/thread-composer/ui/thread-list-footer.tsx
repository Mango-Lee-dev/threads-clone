import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { User } from "@/src/types";

interface ThreadListFooterProps {
  user: User | null;
  canAddThread: boolean;
  onAddThread: () => void;
}

export function ThreadListFooter({
  user,
  canAddThread,
  onAddThread,
}: ThreadListFooterProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user?.profileImageUrl }}
          style={styles.avatar}
          placeholder={require("@/assets/images/react-logo.png")}
        />
      </View>
      <Pressable onPress={onAddThread} disabled={!canAddThread}>
        <Text
          style={[
            styles.text,
            isDark && styles.textDark,
            !canAddThread && styles.textDisabled,
          ]}
        >
          Add to thread
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 26,
    paddingTop: 10,
    paddingBottom: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 20,
    paddingTop: 2,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#555",
  },
  text: {
    fontSize: 15,
    color: "#999",
  },
  textDark: {
    color: "#666",
  },
  textDisabled: {
    color: "#ccc",
  },
});
