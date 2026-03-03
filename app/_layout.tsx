import { Stack, useRouter } from "expo-router";
import { createContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import Constants from "expo-constants";

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

function AnimatedSplashScreen({
  image,
  children,
  onReady,
}: {
  image: number;
  children: React.ReactNode;
  onReady: () => Promise<void>;
}) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] =
    useState(false);

  const animation = useRef(new Animated.Value(1)).current;

  const onImageLoaded = async () => {
    try {
      await onReady();
    } catch (error) {
      // 에러 무시
    } finally {
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    if (!isAppReady) return;
    Animated.timing(animation, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setIsSplashAnimationComplete(true);
    });
  }, [isAppReady, animation]);

  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                Constants.expoConfig?.splash?.backgroundColor ?? "#ffffff",
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            source={image}
            style={{
              width: Constants.expoConfig?.splash?.imageWidth ?? 200,
              height: Constants.expoConfig?.splash?.imageWidth ?? 200,
              opacity: animation,
              resizeMode: "contain",
              transform: [{ scale: animation }, { rotate: rotateValue }],
            }}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Asset.loadAsync(image).then(() => {
      setIsImageLoaded(true);
    });
  }, [image]);

  const onReady = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

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

  if (!isImageLoaded) return null;

  return (
    <AuthContext.Provider value={{ user, onLogin, onLogout }}>
      <AnimatedSplashScreen image={image} onReady={onReady}>
        {children}
      </AnimatedSplashScreen>
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AnimatedAppLoader image={require("../assets/images/react-logo.png")}>
      <StatusBar
        backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
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
    </AnimatedAppLoader>
  );
}
