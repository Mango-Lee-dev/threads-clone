import { Server, Response } from "miragejs";
import { dummyUsers, userStates } from "../data/users";

export function registerUsersHandlers(server: Server) {
  // 사용자 프로필 조회
  server.get("/users/:userId", (schema, request) => {
    const { userId } = request.params;
    const user = dummyUsers.find((u) => u.id === userId);

    if (!user) {
      return new Response(404, {}, { error: "User not found" });
    }

    // 런타임 상태 반영
    const state = userStates.get(userId);
    if (state) {
      return {
        ...user,
        isFollowing: state.isFollowing,
        isMuted: state.isMuted,
        isBlocked: state.isBlocked,
        isRestricted: state.isRestricted,
        followersCount: state.followersCount,
      };
    }

    return user;
  });

  // 팔로우
  server.post("/users/:userId/follow", (schema, request) => {
    const { userId } = request.params;
    const state = userStates.get(userId);

    if (!state) {
      return new Response(404, {}, { error: "User not found" });
    }

    state.isFollowing = true;
    state.followersCount += 1;
    userStates.set(userId, state);

    return {
      success: true,
      action: "follow",
      userId,
    };
  });

  // 언팔로우
  server.delete("/users/:userId/follow", (schema, request) => {
    const { userId } = request.params;
    const state = userStates.get(userId);

    if (!state) {
      return new Response(404, {}, { error: "User not found" });
    }

    state.isFollowing = false;
    state.followersCount = Math.max(0, state.followersCount - 1);
    userStates.set(userId, state);

    return {
      success: true,
      action: "unfollow",
      userId,
    };
  });

  // 뮤트
  server.post("/users/:userId/mute", (schema, request) => {
    const { userId } = request.params;
    const state = userStates.get(userId);

    if (!state) {
      return new Response(404, {}, { error: "User not found" });
    }

    state.isMuted = true;
    userStates.set(userId, state);

    return {
      success: true,
      action: "mute",
      userId,
    };
  });

  // 뮤트 해제
  server.delete("/users/:userId/mute", (schema, request) => {
    const { userId } = request.params;
    const state = userStates.get(userId);

    if (!state) {
      return new Response(404, {}, { error: "User not found" });
    }

    state.isMuted = false;
    userStates.set(userId, state);

    return {
      success: true,
      action: "unmute",
      userId,
    };
  });

  // 차단
  server.post("/users/:userId/block", (schema, request) => {
    const { userId } = request.params;
    const state = userStates.get(userId);

    if (!state) {
      return new Response(404, {}, { error: "User not found" });
    }

    state.isBlocked = true;
    state.isFollowing = false; // 차단하면 자동 언팔로우
    userStates.set(userId, state);

    return {
      success: true,
      action: "block",
      userId,
    };
  });

  // 차단 해제
  server.delete("/users/:userId/block", (schema, request) => {
    const { userId } = request.params;
    const state = userStates.get(userId);

    if (!state) {
      return new Response(404, {}, { error: "User not found" });
    }

    state.isBlocked = false;
    userStates.set(userId, state);

    return {
      success: true,
      action: "unblock",
      userId,
    };
  });

  // 제한
  server.post("/users/:userId/restrict", (schema, request) => {
    const { userId } = request.params;
    const state = userStates.get(userId);

    if (!state) {
      return new Response(404, {}, { error: "User not found" });
    }

    state.isRestricted = true;
    userStates.set(userId, state);

    return {
      success: true,
      action: "restrict",
      userId,
    };
  });

  // 제한 해제
  server.delete("/users/:userId/restrict", (schema, request) => {
    const { userId } = request.params;
    const state = userStates.get(userId);

    if (!state) {
      return new Response(404, {}, { error: "User not found" });
    }

    state.isRestricted = false;
    userStates.set(userId, state);

    return {
      success: true,
      action: "unrestrict",
      userId,
    };
  });
}
