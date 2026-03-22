import { useCallback } from "react";
import { Alert, Linking } from "react-native";
import * as Location from "expo-location";

interface UseLocationOptions {
  onLocationObtained: (threadId: string, location: [number, number]) => void;
}

export function useLocation({ onLocationObtained }: UseLocationOptions) {
  const getLocation = useCallback(async (threadId: string) => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant location permission to use this feature.",
        [
          { text: "Open Settings", onPress: () => Linking.openSettings() },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync();
      onLocationObtained(threadId, [
        location.coords.latitude,
        location.coords.longitude,
      ]);
    } catch {
      Alert.alert("Error", "Failed to get location. Please try again.");
    }
  }, [onLocationObtained]);

  return { getLocation };
}
