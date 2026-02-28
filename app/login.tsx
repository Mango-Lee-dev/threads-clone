import { Redirect, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContext } from "react";
import { AuthContext } from "./_layout";

export default function Login() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, onLogin } = useContext(AuthContext);

  const handleLogin = async () => {
    await onLogin("wtlee", "1234");
  };

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Pressable onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
      <Pressable onPress={handleLogin} style={styles.loginButton}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
