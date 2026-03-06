import * as Notifications from "expo-notifications";
import type { NotificationHandlingError } from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Asset } from "expo-asset";
import { Alert, Animated, Linking, StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import * as Device from "expo-device";
import { Href, router, Stack } from "expo-router";
import Toast, { BaseToast } from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
  handleSuccess(notificationId: string) {
    console.log("Notification sent successfully:", notificationId);
  },
  handleError(notificationId: string, error: NotificationHandlingError) {
    console.log("Error sending notification:", error);
  },
});

SplashScreen.preventAutoHideAsync().catch(() => {
  console.log("Failed to prevent auto hide");
});

export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
  link?: string;
  showInstagramBadge?: boolean;
  isPrivate?: boolean;
}

export const AuthContext = createContext<{
  user: User | null;
  login?: () => Promise<void>;
  logout?: () => Promise<void>;
  updateUser?: (user: User) => Promise<void>;
}>({
  user: null,
});

function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      setIsSplashReady(true);
    }
    prepare();
  }, [image]);

  const login = (): Promise<void> => {
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "wtlee",
        password: "1234",
      }),
    })
      .then((res) => {
        if (res.status >= 400) {
          return Alert.alert("Error", "Invalid username or password");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync("accessToken", data.accessToken),
          SecureStore.setItemAsync("refreshToken", data.refreshToken),
          AsyncStorage.setItem("user", JSON.stringify(data.user)),
        ]);
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
        return Alert.alert("Error", "Failed to login");
      });
  };

  const logout = () => {
    return Promise.all([
      SecureStore.deleteItemAsync("accessToken"),
      SecureStore.deleteItemAsync("refreshToken"),
      AsyncStorage.removeItem("user"),
    ]).then(() => {
      setUser(null);
    });
  };

  const updateUser = (user: User | null): Promise<void> => {
    setUser(user);
    if (user) {
      return Promise.all([
        AsyncStorage.setItem("user", JSON.stringify(user)),
      ]).then(() => {});
    }
    return Promise.all([AsyncStorage.removeItem("user")]).then(() => {});
  };

  if (!isSplashReady) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    send: "default",
    title: "Original Title",
    body: "Original Body",
    data: {
      someData: "goes here",
    },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function AnimatedSplashScreen({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] =
    useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const { updateUser } = useContext(AuthContext);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setIsSplashAnimationComplete(true));
    }
  }, [isAppReady]);

  async function onFetchUpdateAsync() {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert("Update available", "Please update your app", [
            {
              text: "Update",
              onPress: () => Updates.reloadAsync(),
            },
            { text: "Cancel", style: "cancel" },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  const onImageLoaded = async () => {
    try {
      await Promise.all([
        AsyncStorage.getItem("user").then((user) => {
          updateUser?.(user ? JSON.parse(user) : null);
        }),
        onFetchUpdateAsync(),
      ]);
      await SplashScreen.hideAsync();
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        return Linking.openSettings();
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: "ff4aa6e1-320e-4b9a-8234-03de7d30dc05",
      });

      setExpoPushToken(token.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load app");
    } finally {
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    if (expoPushToken && Device.isDevice) {
      Alert.alert("sendPushNotification", expoPushToken);
      sendPushNotification(expoPushToken);
    }
  }, [expoPushToken]);

  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ flex: 1 }}>
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
              backgroundColor: "#ffffff",
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            source={image}
            style={{
              resizeMode: "contain",
              width: 200,
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

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url as string;
      if (url && url.startsWith("threads://")) {
        Alert.alert("redirect", url);
        router.push(url.replace("threads://", "/") as Href);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        redirect(response.notification);
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();

  const toastConfig = {
    customToast: (props: any) => (
      <BaseToast
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          height: 40,
          borderLeftWidth: 0,
          shadowOpacity: 0,
          justifyContent: "center",
        }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          alignItems: "center",
          height: 40,
        }}
        text1Style={{
          color: "black",
          fontSize: 14,
          fontWeight: "500",
        }}
        text1={props.text1}
        onPress={props.onPress}
      />
    ),
  };

  return (
    <AnimatedAppLoader image={require("../assets/images/react-logo.png")}>
      <StatusBar style="auto" animated hidden={false} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      <Toast config={toastConfig} />
    </AnimatedAppLoader>
  );
}
