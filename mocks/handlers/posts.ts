import { Server, Response } from "miragejs";
import { dummyPosts } from "../data/posts";

let posts = [...dummyPosts];
let nextId = posts.length + 1;

export function registerPostsHandlers(server: Server) {
  // 포스트 목록 조회
  server.get("/posts", (schema, request) => {
    const cursor = request.queryParams?.cursor;

    if (cursor) {
      const cursorIndex = posts.findIndex((p) => p.id === cursor);
      if (cursorIndex === -1 || cursorIndex >= posts.length - 1) {
        return { posts: [] };
      }
      return { posts: posts.slice(cursorIndex + 1, cursorIndex + 6) };
    }

    return { posts: posts.slice(0, 5) };
  });

  // 단일 포스트 조회
  server.get("/posts/:postId", (schema, request) => {
    const { postId } = request.params;
    const post = posts.find((p) => p.id === postId);

    if (post) {
      return post;
    }

    return new Response(404, {}, { error: "Post not found" });
  });

  // 포스트 생성
  server.post("/posts", (schema, request) => {
    const body = JSON.parse(request.requestBody);
    const newPost = {
      id: String(nextId++),
      user: {
        id: "wtlee",
        name: "이우택",
        profileImageUrl: "https://i.pravatar.cc/150?img=10",
        isVerified: true,
      },
      content: body.content,
      timeAgo: "방금 전",
      likes: 0,
      comments: 0,
      reposts: 0,
      imageUrls: body.imageUrls || [],
      location: body.location,
    };

    posts.unshift(newPost);
    return newPost;
  });

  // 포스트 삭제
  server.delete("/posts/:postId", (schema, request) => {
    const { postId } = request.params;
    const index = posts.findIndex((p) => p.id === postId);

    if (index !== -1) {
      posts.splice(index, 1);
      return { success: true };
    }

    return new Response(404, {}, { error: "Post not found" });
  });

  // 좋아요
  server.post("/posts/:postId/like", (schema, request) => {
    const { postId } = request.params;
    const post = posts.find((p) => p.id === postId);

    if (post) {
      post.likes += 1;
      return { likes: post.likes };
    }

    return new Response(404, {}, { error: "Post not found" });
  });

  // 좋아요 취소
  server.delete("/posts/:postId/like", (schema, request) => {
    const { postId } = request.params;
    const post = posts.find((p) => p.id === postId);

    if (post) {
      post.likes = Math.max(0, post.likes - 1);
      return { likes: post.likes };
    }

    return new Response(404, {}, { error: "Post not found" });
  });

  // 리포스트
  server.post("/posts/:postId/repost", (schema, request) => {
    const { postId } = request.params;
    const post = posts.find((p) => p.id === postId);

    if (post) {
      post.reposts += 1;
      return { reposts: post.reposts };
    }

    return new Response(404, {}, { error: "Post not found" });
  });

  // 유저별 포스트 조회
  server.get("/users/:userId/posts", (schema, request) => {
    const { userId } = request.params;
    const cursor = request.queryParams?.cursor;
    const userPosts = posts.filter((p) => p.user.id === userId);

    if (cursor) {
      const cursorIndex = userPosts.findIndex((p) => p.id === cursor);
      if (cursorIndex === -1 || cursorIndex >= userPosts.length - 1) {
        return { posts: [] };
      }
      return { posts: userPosts.slice(cursorIndex + 1, cursorIndex + 6) };
    }

    return { posts: userPosts.slice(0, 5) };
  });
}
