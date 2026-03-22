import { useState, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { ThreadDraft, ReplyOption } from "@/src/types";
import { useCreatePost } from "@/src/features/post";
import { uploadApi } from "@/src/services/api";
import { useImagePicker } from "./use-image-picker";
import { useCamera } from "./use-camera";
import { useLocation } from "./use-location";

function createEmptyThread(): ThreadDraft {
  return {
    id: Date.now().toString(),
    text: "",
    imageUris: [],
  };
}

export function useThreadComposer() {
  const router = useRouter();
  const createPost = useCreatePost();

  const [threads, setThreads] = useState<ThreadDraft[]>([createEmptyThread()]);
  const [replyOption, setReplyOption] = useState<ReplyOption>("Anyone");
  const [isPosting, setIsPosting] = useState(false);

  // Computed values
  const canAddThread = useMemo(() => {
    const lastThread = threads.at(-1);
    return (lastThread?.text.trim().length ?? 0) > 0;
  }, [threads]);

  const canPost = useMemo(() => {
    return threads.some(
      (thread) => thread.text.trim().length > 0 || thread.imageUris.length > 0
    );
  }, [threads]);

  const hasUnsavedChanges = useMemo(() => {
    return threads.some(
      (t) => t.text.trim().length > 0 || t.imageUris.length > 0
    );
  }, [threads]);

  // Thread mutations
  const updateThreadText = useCallback((id: string, text: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === id ? { ...thread, text } : thread
      )
    );
  }, []);

  const addThread = useCallback(() => {
    if (canAddThread) {
      setThreads((prev) => [...prev, createEmptyThread()]);
    }
  }, [canAddThread]);

  const removeThread = useCallback((id: string) => {
    setThreads((prev) => prev.filter((thread) => thread.id !== id));
  }, []);

  // Image handlers
  const addImagesToThread = useCallback((threadId: string, uris: string[]) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? { ...thread, imageUris: [...thread.imageUris, ...uris] }
          : thread
      )
    );
  }, []);

  const addImageToThread = useCallback((threadId: string, uri: string) => {
    addImagesToThread(threadId, [uri]);
  }, [addImagesToThread]);

  const removeImageFromThread = useCallback((threadId: string, uriToRemove: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              imageUris: thread.imageUris.filter((uri) => uri !== uriToRemove),
            }
          : thread
      )
    );
  }, []);

  // Location handler
  const setThreadLocation = useCallback((threadId: string, location: [number, number]) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? { ...thread, location } : thread
      )
    );
  }, []);

  const removeThreadLocation = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? { ...thread, location: undefined } : thread
      )
    );
  }, []);

  // Custom hooks for media/location
  const { pickImages } = useImagePicker({ onImagesSelected: addImagesToThread });
  const { takePhoto } = useCamera({ onPhotoTaken: addImageToThread });
  const { getLocation } = useLocation({ onLocationObtained: setThreadLocation });

  // Cancel handler
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      Alert.alert("Discard thread?", "You have unsaved changes.", [
        { text: "Keep editing", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  }, [hasUnsavedChanges, router]);

  // Post handler
  const handlePost = useCallback(async () => {
    if (!canPost || isPosting) return;
    setIsPosting(true);

    try {
      const validThreads = threads.filter(
        (t) => t.text.trim().length > 0 || t.imageUris.length > 0
      );

      for (const thread of validThreads) {
        // Upload images first if any
        let imageUrls: string[] | undefined;
        if (thread.imageUris.length > 0) {
          imageUrls = await uploadApi.uploadMultiple(thread.imageUris);
        }

        // Create post
        await createPost.mutateAsync({
          content: thread.text,
          imageUrls,
          location: thread.location,
        });
      }

      Toast.show({
        type: "success",
        text1: "Thread posted",
        position: "bottom",
      });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to post thread. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }, [canPost, isPosting, threads, createPost, router]);

  return {
    // State
    threads,
    replyOption,
    isPosting,

    // Computed
    canAddThread,
    canPost,
    hasUnsavedChanges,

    // Thread actions
    updateThreadText,
    addThread,
    removeThread,

    // Image actions
    pickImages,
    takePhoto,
    removeImageFromThread,

    // Location actions
    getLocation,
    removeThreadLocation,

    // Reply option
    setReplyOption,

    // Main actions
    handleCancel,
    handlePost,
  };
}
