import apiClient from "./client";
import { UploadResponse } from "@/src/types";

export const uploadApi = {
  uploadImage: async (uri: string): Promise<UploadResponse> => {
    const formData = new FormData();
    const filename = uri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri,
      name: filename,
      type,
    } as unknown as Blob);

    const response = await apiClient.post<UploadResponse>(
      "/upload/image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  uploadMultiple: async (uris: string[]): Promise<string[]> => {
    const results = await Promise.all(uris.map(uploadApi.uploadImage));
    return results.map((r) => r.url);
  },
};
