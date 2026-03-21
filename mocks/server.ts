import { createServer } from "miragejs";
import { registerAuthHandlers } from "./handlers/auth";
import { registerPostsHandlers } from "./handlers/posts";

declare global {
  interface Window {
    server: ReturnType<typeof createServer>;
  }
}

export function setupMockServer() {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      registerAuthHandlers(this);
      registerPostsHandlers(this);

      // 처리되지 않은 요청은 통과
      this.passthrough();
    },
  });

  return window.server;
}
