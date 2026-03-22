import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ThreadDraft, User } from "@/src/types";
import { ThreadActionButtons } from "./thread-action-buttons";
import { ThreadImageGallery } from "./thread-image-gallery";
import { LocationBadge } from "./location-badge";

interface ThreadItemProps {
  thread: ThreadDraft;
  index: number;
  user: User | null;
  onTextChange: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onPickImages: (id: string) => void;
  onTakePhoto: (id: string) => void;
  onGetLocation: (id: string) => void;
  onRemoveImage: (id: string, uri: string) => void;
  onRemoveLocation: (id: string) => void;
  isPosting: boolean;
}

export function ThreadItem({
  thread,
  index,
  user,
  onTextChange,
  onRemove,
  onPickImages,
  onTakePhoto,
  onGetLocation,
  onRemoveImage,
  onRemoveLocation,
  isPosting,
}: ThreadItemProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user?.profileImageUrl }}
          style={styles.avatar}
          placeholder={require("@/assets/images/react-logo.png")}
        />
        <View style={[styles.threadLine, isDark && styles.threadLineDark]} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.username, isDark && styles.usernameDark]}>
            {user?.id || "username"}
          </Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => onRemove(thread.id)}
              style={styles.removeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={isPosting}
            >
              <Ionicons
                name="close-outline"
                size={20}
                color={isPosting ? "#ccc" : "#8e8e93"}
              />
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="What's new?"
          placeholderTextColor="#999"
          value={thread.text}
          onChangeText={(text) => onTextChange(thread.id, text)}
          multiline
          editable={!isPosting}
        />

        <ThreadImageGallery
          threadId={thread.id}
          imageUris={thread.imageUris}
          onRemoveImage={onRemoveImage}
          disabled={isPosting}
        />

        {thread.location && (
          <LocationBadge
            location={thread.location}
            onRemove={() => onRemoveLocation(thread.id)}
          />
        )}

        <ThreadActionButtons
          threadId={thread.id}
          onPickImages={onPickImages}
          onTakePhoto={onTakePhoto}
          onGetLocation={onGetLocation}
          disabled={isPosting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 12,
    paddingTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#555",
  },
  threadLine: {
    width: 1.5,
    flexGrow: 1,
    backgroundColor: "#ddd",
    marginTop: 8,
  },
  threadLineDark: {
    backgroundColor: "#444",
  },
  content: {
    flex: 1,
    paddingBottom: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },
  usernameDark: {
    color: "#fff",
  },
  input: {
    fontSize: 15,
    paddingTop: 4,
    paddingBottom: 8,
    minHeight: 24,
    lineHeight: 20,
    color: "#000",
  },
  inputDark: {
    color: "#fff",
  },
  removeButton: {
    padding: 4,
    marginRight: -4,
    marginLeft: 8,
  },
});
