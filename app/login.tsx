import { Redirect, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const isLoggedIn = false;
  const insects = useSafeAreaInsets();
  const router = useRouter();

  const onLogin = () => {
    fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "wtlee",
        password: "1234",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Alert.alert("Error", data.error);
        } else {
          console.log(data);
          SecureStore.setItemAsync("accessToken", data.accessToken);
          SecureStore.setItemAsync("refreshToken", data.refreshToken);
          AsyncStorage.setItem("user", JSON.stringify(data.user));
          router.navigate("/");
        }
      });
  };

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insects.top,
        paddingBottom: insects.bottom,
      }}
    >
      <Pressable onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
      <Pressable onPress={onLogin} style={styles.loginButton}>
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
  loginButtonText: {
    color: "white",
  },
});
