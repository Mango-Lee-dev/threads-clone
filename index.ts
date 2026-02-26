import "expo-router/entry";
import { createServer } from "miragejs";

declare global {
  interface Window {
    server: ReturnType<typeof createServer>;
  }
}

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.post("/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === "wtlee" && password === "1234") {
          return {
            accessToken: "access-token",
            refreshToken: "refresh-token",
            user: {
              id: "wtlee",
            },
          };
        }
        return {
          error: "Invalid username or password",
        };
      });
    },
  });
}
