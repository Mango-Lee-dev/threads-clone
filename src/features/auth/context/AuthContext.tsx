import { createContext, useState, useCallback, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { User } from "@/src/types";
import { authApi } from "@/src/services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User | null) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  updateUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.login({ username, password });

      await Promise.all([
        SecureStore.setItemAsync("accessToken", data.accessToken),
        SecureStore.setItemAsync("refreshToken", data.refreshToken),
        AsyncStorage.setItem("user", JSON.stringify(data.user)),
      ]);

      setUser(data.user);
    } catch (error: any) {
      const message = error?.error || error?.message || "로그인에 실패했습니다.";
      Alert.alert("오류", message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        SecureStore.deleteItemAsync("accessToken"),
        SecureStore.deleteItemAsync("refreshToken"),
        AsyncStorage.removeItem("user"),
      ]);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem("user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
