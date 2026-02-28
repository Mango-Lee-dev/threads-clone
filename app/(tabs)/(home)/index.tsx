import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useContext, useState } from "react";
import { AuthContext } from "@/app/_layout";
import SideMenu from "@/components/side-menu";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { user, onLogin, onLogout } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
      <BlurView style={styles.header}>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.headerLogo}
        />
        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              setIsLoginModalOpen(true);
            }}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        )}
        {isLoginModalOpen && (
          <SideMenu
            isVisible={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        )}
      </BlurView>
      {isLoggedIn && (
        <View style={styles.tabContainer}>
          <View style={styles.tab}>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={{ color: pathname === "/" ? "red" : "black" }}>
                For you
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tab}>
            <TouchableOpacity onPress={() => router.push("/following")}>
              <Text style={{ color: pathname === "/following" ? "red" : "black" }}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
});
