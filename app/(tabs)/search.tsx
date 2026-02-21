import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Search</Text>
      </View>
    </SafeAreaView>
  );
}
