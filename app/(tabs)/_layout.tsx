import { Tabs, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  const router = useRouter();
  const isLoggedIn = false;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const toLoginPage = () => {
    router.push("/login");
    closeLoginModal();
  };
  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="search"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              if (isLoggedIn) {
                router.navigate("/modal");
              } else {
                openLoginModal();
              }
            },
          })}
          options={{
            title: "Add",
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="add"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          listeners={() => ({
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          })}
          options={{
            title: "Activity",
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="heart-outline"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="[username]"
          listeners={() => ({
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          })}
          options={{
            title: "username",
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person-outline"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(post)/[username]/post/[postId]"
          options={{
            href: null,
            tabBarLabel: () => null,
          }}
        />
      </Tabs>
      <Modal
        visible={isLoginModalOpen}
        onRequestClose={closeLoginModal}
        transparent
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Pressable
              onPress={toLoginPage}
              style={{ backgroundColor: "blue", padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: "white" }}>Login</Text>
            </Pressable>
            <TouchableOpacity onPress={closeLoginModal}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const AnimatedTabBarButton = ({
  children,
  ref: _ref,
  ...rest
}: BottomTabBarButtonProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const handlePressOut = () => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 200,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        speed: 200,
      }),
    ]).start();
  };

  return (
    <Pressable
      {...rest}
      onPressOut={handlePressOut}
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
      android_ripple={{
        borderless: false,
        radius: 0,
      }}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
