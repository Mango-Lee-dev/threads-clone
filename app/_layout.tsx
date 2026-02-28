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
  onLogin: () => {},
  onLogout: () => {},
});

export default function RootLayout() {
  const [user, setUser] = useState(null);
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
          setUser(data.user);
          router.replace("/");
        }
      });
  };

  const onLogout = () => {
    SecureStore.deleteItemAsync("accessToken");
    SecureStore.deleteItemAsync("refreshToken");
    AsyncStorage.removeItem("user");
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
