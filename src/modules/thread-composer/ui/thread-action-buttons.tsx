import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

interface ThreadActionButtonsProps {
  threadId: string;
  onPickImages: (threadId: string) => void;
  onTakePhoto: (threadId: string) => void;
  onGetLocation: (threadId: string) => void;
  disabled?: boolean;
}

export function ThreadActionButtons({
  threadId,
  onPickImages,
  onTakePhoto,
  onGetLocation,
  disabled,
}: ThreadActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => !disabled && onPickImages(threadId)}
        disabled={disabled}
      >
        <Ionicons
          name="image-outline"
          size={24}
          color={disabled ? "#ccc" : "#777"}
        />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => !disabled && onTakePhoto(threadId)}
        disabled={disabled}
      >
        <Ionicons
          name="camera-outline"
          size={24}
          color={disabled ? "#ccc" : "#777"}
        />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => !disabled && onGetLocation(threadId)}
        disabled={disabled}
      >
        <FontAwesome
          name="map-marker"
          size={24}
          color={disabled ? "#ccc" : "#777"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginRight: 15,
    padding: 4,
  },
});
