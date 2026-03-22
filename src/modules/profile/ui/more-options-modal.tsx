import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "@/src/types";
import {
  useMuteUser,
  useUnmuteUser,
  useBlockUser,
  useUnblockUser,
  useRestrictUser,
  useUnrestrictUser,
} from "@/src/features/user";

interface MoreOptionsModalProps {
  visible: boolean;
  profile: UserProfile;
  onClose: () => void;
  onReport?: () => void;
}

interface OptionItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isDestructive?: boolean;
  onPress: () => void;
}

export function MoreOptionsModal({
  visible,
  profile,
  onClose,
  onReport,
}: MoreOptionsModalProps) {
  const isDark = useColorScheme() === "dark";

  const muteMutation = useMuteUser(profile.id);
  const unmuteMutation = useUnmuteUser(profile.id);
  const blockMutation = useBlockUser(profile.id);
  const unblockMutation = useUnblockUser(profile.id);
  const restrictMutation = useRestrictUser(profile.id);
  const unrestrictMutation = useUnrestrictUser(profile.id);

  const handleMute = () => {
    if (profile.isMuted) {
      unmuteMutation.mutate();
    } else {
      muteMutation.mutate();
    }
    onClose();
  };

  const handleBlock = () => {
    if (profile.isBlocked) {
      unblockMutation.mutate();
      onClose();
    } else {
      Alert.alert(
        `Block @${profile.id}?`,
        "They won't be able to find your profile, posts, or threads. Threads won't let them know you blocked them.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Block",
            style: "destructive",
            onPress: () => {
              blockMutation.mutate();
              onClose();
            },
          },
        ]
      );
    }
  };

  const handleRestrict = () => {
    if (profile.isRestricted) {
      unrestrictMutation.mutate();
    } else {
      restrictMutation.mutate();
    }
    onClose();
  };

  const handleReport = () => {
    onClose();
    onReport?.();
  };

  const options: OptionItem[] = [
    {
      icon: profile.isMuted ? "volume-high" : "volume-mute",
      label: profile.isMuted ? "Unmute" : "Mute",
      onPress: handleMute,
    },
    {
      icon: profile.isRestricted ? "shield-checkmark" : "shield",
      label: profile.isRestricted ? "Unrestrict" : "Restrict",
      onPress: handleRestrict,
    },
    {
      icon: profile.isBlocked ? "close-circle-outline" : "close-circle",
      label: profile.isBlocked ? "Unblock" : "Block",
      isDestructive: !profile.isBlocked,
      onPress: handleBlock,
    },
    {
      icon: "flag",
      label: "Report",
      isDestructive: true,
      onPress: handleReport,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.container, isDark && styles.containerDark]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={[styles.headerText, isDark && styles.headerTextDark]}>
              @{profile.id}
            </Text>
          </View>

          <View style={styles.optionsList}>
            {options.map((option, index) => (
              <Pressable
                key={option.label}
                style={[
                  styles.option,
                  index < options.length - 1 && styles.optionBorder,
                  isDark && styles.optionBorderDark,
                ]}
                onPress={option.onPress}
              >
                <Ionicons
                  name={option.icon}
                  size={22}
                  color={option.isDestructive ? "#FF3B30" : isDark ? "#fff" : "#000"}
                />
                <Text
                  style={[
                    styles.optionText,
                    isDark && styles.optionTextDark,
                    option.isDestructive && styles.optionTextDestructive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, isDark && styles.cancelTextDark]}>
              Cancel
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  containerDark: {
    backgroundColor: "#1c1c1e",
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  headerTextDark: {
    color: "#fff",
  },
  optionsList: {
    paddingVertical: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  optionBorderDark: {
    borderBottomColor: "#333",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 16,
  },
  optionTextDark: {
    color: "#fff",
  },
  optionTextDestructive: {
    color: "#FF3B30",
  },
  cancelButton: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 14,
    paddingVertical: 16,
  },
  cancelButtonDark: {
    backgroundColor: "#2c2c2e",
  },
  cancelText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  cancelTextDark: {
    color: "#fff",
  },
});
