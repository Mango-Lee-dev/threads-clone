import { View, Text, Pressable, StyleSheet, useColorScheme, Share } from "react-native";
import { useRouter } from "expo-router";
import { UserProfile } from "@/src/types";

interface OwnProfileActionsProps {
  profile: UserProfile;
}

export function OwnProfileActions({ profile }: OwnProfileActionsProps) {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    router.push("/edit-profile" as never);
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out @${profile.id} on Threads`,
        url: `https://threads.net/@${profile.id}`,
      });
    } catch {
      // User cancelled or error occurred
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, isDark && styles.buttonDark]}
        onPress={handleEditProfile}
      >
        <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
          Edit profile
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, isDark && styles.buttonDark]}
        onPress={handleShareProfile}
      >
        <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
          Share profile
        </Text>
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
  button: {
    flex: 1,
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDark: {
    backgroundColor: "#1c1c1c",
    borderColor: "#333",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  buttonTextDark: {
    color: "#fff",
  },
});
