import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";

interface ComposerHeaderProps {
  onCancel: () => void;
  isPosting: boolean;
}

export function ComposerHeader({ onCancel, isPosting }: ComposerHeaderProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <Pressable onPress={onCancel} disabled={isPosting}>
        <Text
          style={[
            styles.cancel,
            isDark && styles.cancelDark,
            isPosting && styles.disabledText,
          ]}
        >
          Cancel
        </Text>
      </Pressable>
      <Text style={[styles.title, isDark && styles.titleDark]}>New thread</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerDark: {
    backgroundColor: "#101010",
  },
  cancel: {
    fontSize: 16,
    color: "#000",
  },
  cancelDark: {
    color: "#fff",
  },
  disabledText: {
    color: "#ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  placeholder: {
    width: 60,
  },
});
