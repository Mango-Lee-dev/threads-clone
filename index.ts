import "expo-router/entry";
import { setupMockServer } from "./mocks/server";

if (__DEV__) {
  setupMockServer();
}
