import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { ReplyOption } from "@/src/types";

const REPLY_OPTIONS: ReplyOption[] = [
  "Anyone",
  "Profiles you follow",
  "Mentioned only",
];

interface ReplyOptionModalProps {
  visible: boolean;
  selectedOption: ReplyOption;
  onSelect: (option: ReplyOption) => void;
  onClose: () => void;
}

export function ReplyOptionModal({
  visible,
  selectedOption,
  onSelect,
  onClose,
}: ReplyOptionModalProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[styles.container, isDark && styles.containerDark]}
        >
          {REPLY_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  isDark && styles.optionTextDark,
                  selectedOption === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  container: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#2c2c2e",
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  selectedOption: {},
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  optionTextDark: {
    color: "#fff",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#007AFF",
  },
});
