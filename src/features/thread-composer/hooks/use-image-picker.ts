import { useCallback } from "react";
import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface UseImagePickerOptions {
  onImagesSelected: (threadId: string, uris: string[]) => void;
}

export function useImagePicker({ onImagesSelected }: UseImagePickerOptions) {
  const pickImages = useCallback(async (threadId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant photo library permission to add images.",
        [
          { text: "Open Settings", onPress: () => Linking.openSettings() },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset) => asset.uri);
      onImagesSelected(threadId, uris);
    }
  }, [onImagesSelected]);

  return { pickImages };
}
