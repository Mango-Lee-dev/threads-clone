import { Stack, useRouter } from "expo-router";
import { createContext, useState } from "react";
import { Alert } from "react-native";
import "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const unstable_settings = {
  anchor: "(tabs)",
};

type User = {
  id: string;
};

export const AuthContext = createContext({
  user: null as User | null,
  onLogin: async (_username: string, _password: string) => {},
  onLogout: async () => {},
});

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const onLogin = async (username: string, password: string) => {
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.error) {
        Alert.alert("Error", data.error);
        return;
      }

      await SecureStore.setItemAsync("accessToken", data.accessToken);
      await SecureStore.setItemAsync("refreshToken", data.refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "네트워크 오류가 발생했습니다.");
    }
  };

  const onLogout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await AsyncStorage.removeItem("user");
    setUser(null);
    router.replace("/login");
  };
  return (
    <AuthContext value={{ user, onLogin, onLogout }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </AuthContext>
  );
}
