import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SideMenu({ isVisible, onClose }: SideMenuProps) {
  const router = useRouter();

  const handleLoginPress = () => {
    onClose();
    router.push("/login");
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>로그인이 필요합니다</Text>
          <Pressable style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 12,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
});
