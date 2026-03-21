import * as Notifications from "expo-notifications";
import type { NotificationHandlingError } from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { Asset } from "expo-asset";
import { Alert, Animated, Linking, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import * as Device from "expo-device";
import { Href, router, Stack } from "expo-router";
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/src/features/auth";
import { QueryProvider } from "@/src/providers/QueryProvider";
import { User } from "@/src/types";

// Re-export for backward compatibility
export { AuthContext } from "@/src/features/auth";
export type { User } from "@/src/types";

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

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
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

function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [initialUser, setInitialUser] = useState<User | null>(null);
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      // 저장된 사용자 정보 복원
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        setInitialUser(JSON.parse(userJson));
      }
      setIsSplashReady(true);
    }
    prepare();
  }, [image]);

  if (!isSplashReady) {
    return null;
  }

  return (
    <QueryProvider>
      <AuthProvider initialUser={initialUser}>
        <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
      </AuthProvider>
    </QueryProvider>
  );
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
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setIsSplashAnimationComplete(true));
    }
  }, [isAppReady, animation]);

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
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  const onImageLoaded = async () => {
    try {
      await onFetchUpdateAsync();
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
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url as string;
      if (url && url.startsWith("threads://")) {
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
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
}

const toastConfig = {
  customToast: (props: BaseToastProps) => (
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

export default function RootLayout() {
  useNotificationObserver();

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
