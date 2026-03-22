import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LocationBadgeProps {
  location: [number, number];
  onRemove?: () => void;
}

export function LocationBadge({ location, onRemove }: LocationBadgeProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="location" size={14} color="#8e8e93" />
      <Text style={styles.text}>
        {location[0].toFixed(4)}, {location[1].toFixed(4)}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="close-circle" size={16} color="#8e8e93" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#8e8e93",
    marginLeft: 4,
  },
  removeButton: {
    marginLeft: 8,
  },
});
