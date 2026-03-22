import { Server } from "miragejs";

export function registerUploadHandlers(server: Server) {
  // 이미지 업로드 핸들러
  server.post("/upload/image", () => {
    // Mock: 랜덤 이미지 URL 반환
    const randomId = Math.random().toString(36).substring(7);
    return {
      url: `https://picsum.photos/seed/${randomId}/400/400`,
      filename: `image_${Date.now()}.jpg`,
    };
  });
}
