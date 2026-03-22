import { useLocalSearchParams, withLayoutContext } from "expo-router";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContext, useState, useMemo } from "react";
import { AuthContext } from "@/app/_layout";
import { Ionicons } from "@expo/vector-icons";
import SideMenu from "@/components/side-menu";
import { useUserProfile } from "@/src/features/user";
import {
  ProfileHeader,
  OwnProfileActions,
  OtherProfileActions,
  MoreOptionsModal,
} from "@/src/modules/profile";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const { username } = useLocalSearchParams<{ username: string }>();

  // username에서 userId 추출 (@ 접두사 제거)
  const userId = useMemo(() => {
    if (!username) return "";
    return username.startsWith("@") ? username.slice(1) : username;
  }, [username]);

  // 본인 프로필 여부 확인
  const isOwnProfile = useMemo(() => {
    return isLoggedIn && user?.id === userId;
  }, [isLoggedIn, user?.id, userId]);

  // 프로필 데이터 조회 (본인이 아닌 경우에만 API 호출)
  const {
    data: fetchedProfile,
    isLoading,
    isError,
  } = useUserProfile(isOwnProfile ? "" : userId);

  // 본인 프로필일 경우 AuthContext의 user 데이터 사용
  const profile = useMemo(() => {
    if (isOwnProfile && user) {
      return {
        ...user,
        isVerified: true,
        followersCount: 0,
        followingCount: 0,
        isFollowing: false,
        isFollowedBy: false,
        isMuted: false,
        isBlocked: false,
        isRestricted: false,
      };
    }
    return fetchedProfile;
  }, [isOwnProfile, user, fetchedProfile]);

  const handleMentionPress = () => {
    // TODO: Navigate to compose with mention
  };

  const handleMorePress = () => {
    setIsMoreModalOpen(true);
  };

  const handleFollowersPress = () => {
    // TODO: Navigate to followers list
  };

  return (
    <View
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
        {isLoggedIn && (
          <Pressable
            style={styles.menuButton}
            onPress={() => setIsSideMenuOpen(true)}
          >
            <Ionicons
              name="menu"
              size={24}
              color={isDark ? "gray" : "black"}
            />
          </Pressable>
        )}
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.logo}
        />
        <SideMenu
          isVisible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
      </View>

      {/* Profile Section */}
      {isLoading && !isOwnProfile ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : isError && !isOwnProfile ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            Failed to load profile
          </Text>
        </View>
      ) : profile ? (
        <View>
          <ProfileHeader
            profile={profile}
            onFollowersPress={handleFollowersPress}
          />
          {isOwnProfile ? (
            <OwnProfileActions profile={profile} />
          ) : (
            <OtherProfileActions
              profile={profile}
              onMentionPress={handleMentionPress}
              onMorePress={handleMorePress}
            />
          )}
        </View>
      ) : null}

      {/* Tabs */}
      <MaterialTopTabs
        screenOptions={{
          lazy: true,
          tabBarStyle: {
            backgroundColor: isDark ? "#101010" : "white",
            shadowColor: "transparent",
            position: "relative",
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
          tabBarPressColor: "transparent",
          tabBarActiveTintColor: isDark ? "white" : "#555",
          tabBarIndicatorStyle: {
            backgroundColor: isDark ? "white" : "black",
            height: 1,
          },
          tabBarIndicatorContainerStyle: {
            backgroundColor: isDark ? "#aaa" : "#555",
            position: "absolute",
            top: 48,
            height: 1,
          },
        }}
      >
        <MaterialTopTabs.Screen name="index" options={{ title: "Threads" }} />
        <MaterialTopTabs.Screen name="replies" options={{ title: "Replies" }} />
        <MaterialTopTabs.Screen name="reposts" options={{ title: "Reposts" }} />
      </MaterialTopTabs>

      {/* More Options Modal */}
      {profile && !isOwnProfile && (
        <MoreOptionsModal
          visible={isMoreModalOpen}
          profile={profile}
          onClose={() => setIsMoreModalOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
  },
  headerLight: {
    backgroundColor: "white",
  },
  headerDark: {
    backgroundColor: "#101010",
  },
  logo: {
    width: 32,
    height: 32,
  },
  menuButton: {
    position: "absolute",
    left: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  errorTextDark: {
    color: "#999",
  },
});
