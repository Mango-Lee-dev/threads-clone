import { Server, Response } from "miragejs";
import { dummyUsers } from "../data/posts";

export function registerAuthHandlers(server: Server) {
  server.post("/login", (schema, request) => {
    const { username, password } = JSON.parse(request.requestBody);

    if (username === "wtlee" && password === "1234") {
      return {
        accessToken: "mock-access-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now(),
        user: dummyUsers.wtlee,
      };
    }

    return new Response(401, {}, { error: "Invalid username or password" });
  });

  server.post("/logout", () => {
    return { success: true };
  });

  server.post("/refresh", (schema, request) => {
    const { refreshToken } = JSON.parse(request.requestBody);

    if (refreshToken) {
      return {
        accessToken: "mock-access-token-refreshed-" + Date.now(),
      };
    }

    return new Response(401, {}, { error: "Invalid refresh token" });
  });

  server.get("/me", () => {
    return dummyUsers.wtlee;
  });

  server.get("/users/:userId", (schema, request) => {
    const { userId } = request.params;
    const user = dummyUsers[userId as keyof typeof dummyUsers];

    if (user) {
      return user;
    }

    return new Response(404, {}, { error: "User not found" });
  });

  server.put("/users/:userId", (schema, request) => {
    const { userId } = request.params;
    const updates = JSON.parse(request.requestBody);
    const user = dummyUsers[userId as keyof typeof dummyUsers];

    if (user) {
      return { ...user, ...updates };
    }

    return new Response(404, {}, { error: "User not found" });
  });
}
