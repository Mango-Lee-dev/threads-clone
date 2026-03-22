import { useContext, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "@/app/_layout";
import { useThreadComposer } from "@/src/features/thread-composer";
import { ThreadDraft } from "@/src/types";
import { ComposerHeader } from "./composer-header";
import { ComposerFooter } from "./composer-footer";
import { ReplyOptionModal } from "./reply-option-modal";
import { ThreadItem } from "./thread-item";
import { ThreadListFooter } from "./thread-list-footer";

export function ThreadComposer() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const { user } = useContext(AuthContext);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);

  const {
    threads,
    replyOption,
    isPosting,
    canAddThread,
    canPost,
    updateThreadText,
    addThread,
    removeThread,
    pickImages,
    takePhoto,
    removeImageFromThread,
    getLocation,
    removeThreadLocation,
    setReplyOption,
    handleCancel,
    handlePost,
  } = useThreadComposer();

  const renderThreadItem = useCallback(
    ({ item, index }: { item: ThreadDraft; index: number }) => (
      <ThreadItem
        thread={item}
        index={index}
        user={user}
        onTextChange={updateThreadText}
        onRemove={removeThread}
        onPickImages={pickImages}
        onTakePhoto={takePhoto}
        onGetLocation={getLocation}
        onRemoveImage={removeImageFromThread}
        onRemoveLocation={removeThreadLocation}
        isPosting={isPosting}
      />
    ),
    [
      user,
      updateThreadText,
      removeThread,
      pickImages,
      takePhoto,
      getLocation,
      removeImageFromThread,
      removeThreadLocation,
      isPosting,
    ]
  );

  const renderFooter = useCallback(
    () => (
      <ThreadListFooter
        user={user}
        canAddThread={canAddThread}
        onAddThread={addThread}
      />
    ),
    [user, canAddThread, addThread]
  );

  return (
    <View
      style={[
        styles.container,
        isDark && styles.containerDark,
        { paddingTop: insets.top },
      ]}
    >
      <ComposerHeader onCancel={handleCancel} isPosting={isPosting} />

      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={renderThreadItem}
        ListFooterComponent={renderFooter}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!isPosting}
      />

      <ComposerFooter
        replyOption={replyOption}
        onReplyOptionPress={() => setIsReplyModalVisible(true)}
        onPost={handlePost}
        canPost={canPost}
        isPosting={isPosting}
        bottomInset={insets.bottom}
      />

      <ReplyOptionModal
        visible={isReplyModalVisible}
        selectedOption={replyOption}
        onSelect={setReplyOption}
        onClose={() => setIsReplyModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  list: {
    flex: 1,
  },
});
