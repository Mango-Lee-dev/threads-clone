import { useCallback } from "react";
import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface UseCameraOptions {
  onPhotoTaken: (threadId: string, uri: string) => void;
}

export function useCamera({ onPhotoTaken }: UseCameraOptions) {
  const takePhoto = useCallback(async (threadId: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant camera permission to take photos.",
        [
          { text: "Open Settings", onPress: () => Linking.openSettings() },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onPhotoTaken(threadId, result.assets[0].uri);
    }
  }, [onPhotoTaken]);

  return { takePhoto };
}
