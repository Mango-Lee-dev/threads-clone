import {
  Pressable,
  TextInput,
  useColorScheme,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../_layout";
import { Ionicons } from "@expo/vector-icons";
import SideMenu from "@/components/side-menu";
import { UserSearchItem } from "@/components/search";
import { searchApi } from "@/src/services/api";
import { UserProfile } from "@/src/types";

export default function SearchScreen() {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsInitialLoading(true);
        const suggestions = await searchApi.getSuggestions();
        setUsers(suggestions);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery.trim()) {
      // Reset to suggestions when query is empty
      const fetchSuggestions = async () => {
        try {
          setIsLoading(true);
          const suggestions = await searchApi.getSuggestions();
          setUsers(suggestions);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuggestions();
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchApi.searchUsers(searchQuery.trim());
        setUsers(results);
      } catch (error) {
        console.error("Search failed:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleFollowChange = useCallback(
    (userId: string, isFollowing: boolean) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, isFollowing } : u))
      );
    },
    []
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderItem = useCallback(
    ({ item }: { item: UserProfile }) => (
      <UserSearchItem user={item} onFollowChange={handleFollowChange} />
    ),
    [handleFollowChange]
  );

  const keyExtractor = useCallback((item: UserProfile) => item.id, []);

  const ListEmptyComponent = () => {
    if (isLoading || isInitialLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
        </View>
      );
    }

    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="search-outline"
            size={48}
            color={isDark ? "#555" : "#ccc"}
          />
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            No results found
          </Text>
          <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
            Try searching for a different name or username
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="people-outline"
          size={48}
          color={isDark ? "#555" : "#ccc"}
        />
        <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
          No suggestions available
        </Text>
      </View>
    );
  };

  const ListHeaderComponent = () => {
    if (!searchQuery.trim() && users.length > 0) {
      return (
        <Text
          style={[
            styles.sectionHeader,
            isDark ? styles.sectionHeaderDark : styles.sectionHeaderLight,
          ]}
        >
          Suggested for you
        </Text>
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
        isDark ? styles.containerDark : styles.containerLight,
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          isDark ? styles.headerDark : styles.headerLight,
        ]}
      >
        {isLoggedIn && (
          <Pressable
            style={styles.menuButton}
            onPress={() => {
              setIsSideMenuOpen(true);
            }}
          >
            <Ionicons
              name="menu"
              size={24}
              color={isDark ? "#999" : "#000"}
            />
          </Pressable>
        )}
        <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
          Search
        </Text>
        <SideMenu
          isVisible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View
          style={[
            styles.searchBar,
            isDark ? styles.searchBarDark : styles.searchBarLight,
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDark ? "#888" : "#666"}
          />
          <TextInput
            style={[
              styles.searchInput,
              isDark ? styles.searchInputDark : styles.searchInputLight,
            ]}
            placeholder="Search"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <Ionicons
                name="close-circle"
                size={18}
                color={isDark ? "#666" : "#999"}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* User List */}
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={[
          styles.listContent,
          users.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => (
          <View
            style={[
              styles.separator,
              isDark ? styles.separatorDark : styles.separatorLight,
            ]}
          />
        )}
      />
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
  menuButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  titleLight: {
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchBarLight: {
    backgroundColor: "#f0f0f0",
  },
  searchBarDark: {
    backgroundColor: "#1c1c1c",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: 40,
  },
  searchInputLight: {
    color: "#000",
  },
  searchInputDark: {
    color: "#fff",
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  listContentEmpty: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderLight: {
    color: "#000",
  },
  sectionHeaderDark: {
    color: "#fff",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 76,
  },
  separatorLight: {
    backgroundColor: "#e0e0e0",
  },
  separatorDark: {
    backgroundColor: "#2c2c2c",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    color: "#666",
  },
  emptyTextDark: {
    color: "#999",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  emptySubtextDark: {
    color: "#666",
  },
});
