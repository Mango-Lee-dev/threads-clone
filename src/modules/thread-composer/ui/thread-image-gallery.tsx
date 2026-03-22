import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ThreadImageGalleryProps {
  threadId: string;
  imageUris: string[];
  onRemoveImage: (threadId: string, uri: string) => void;
  disabled?: boolean;
}

export function ThreadImageGallery({
  threadId,
  imageUris,
  onRemoveImage,
  disabled,
}: ThreadImageGalleryProps) {
  if (imageUris.length === 0) return null;

  return (
    <FlatList
      data={imageUris}
      renderItem={({ item: uri }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri }} style={styles.image} />
          <TouchableOpacity
            onPress={() => !disabled && onRemoveImage(threadId, uri)}
            style={styles.removeButton}
            disabled={disabled}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="rgba(0,0,0,0.7)"
            />
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(uri, index) => `${threadId}-img-${index}-${uri}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 12,
    marginBottom: 4,
  },
  imageContainer: {
    position: "relative",
    marginRight: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 2,
  },
});
