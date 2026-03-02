import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View>
        <TouchableOpacity>
          <Text
            style={
              colorScheme === "dark"
                ? styles.textDefaultDark
                : styles.textDefaultLight
            }
          >
            게시글 1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={
              colorScheme === "dark"
                ? styles.textDefaultDark
                : styles.textDefaultLight
            }
          >
            게시글 2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={
              colorScheme === "dark"
                ? styles.textDefaultDark
                : styles.textDefaultLight
            }
          >
            게시글 3
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
  },
  header: {
    alignItems: "center",
  },
  headerLogo: {
    width: 42,
    height: 42,
  },
  loginButton: {
    position: "absolute",
    right: 20,
    top: 0,
    borderWidth: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "white",
  },
  textDefaultDark: {
    color: "white",
  },
  textDefaultLight: {
    color: "black",
  },
});
