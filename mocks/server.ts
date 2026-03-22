import { createServer } from "miragejs";
import { registerAuthHandlers } from "./handlers/auth";
import { registerPostsHandlers } from "./handlers/posts";
import { registerUploadHandlers } from "./handlers/upload";
import { registerUsersHandlers } from "./handlers/users";

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
      registerUploadHandlers(this);
      registerUsersHandlers(this);

      // 외부 API 요청은 통과
      this.passthrough("https://exp.host/**");
      this.passthrough("https://expo.dev/**");
      this.passthrough("http://192.168.**");
      this.passthrough("http://localhost:**");
      this.passthrough();
    },
  });

  return window.server;
}
