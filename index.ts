import "expo-router/entry";
import { createServer } from "miragejs";

declare global {
  interface Window {
    server: ReturnType<typeof createServer>;
  }
}

const dummyPosts = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "김철수",
      profileImageUrl: "https://i.pravatar.cc/150?img=1",
      isVerified: true,
    },
    content: "오늘 날씨가 정말 좋네요! 산책하기 딱 좋은 날이에요 🌸",
    timeAgo: "2분 전",
    likes: 42,
    comments: 5,
    reposts: 3,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "이영희",
      profileImageUrl: "https://i.pravatar.cc/150?img=2",
      isVerified: false,
    },
    content: "새로운 프로젝트 시작했습니다. React Native로 앱 만드는 중! 💻",
    timeAgo: "15분 전",
    likes: 128,
    comments: 23,
    reposts: 12,
    imageUrls: ["https://picsum.photos/400/300?random=1"],
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "박민수",
      profileImageUrl: "https://i.pravatar.cc/150?img=3",
      isVerified: true,
    },
    content: "주말에 맛있는 카페 발견! 커피가 정말 맛있었어요 ☕️",
    timeAgo: "1시간 전",
    likes: 89,
    comments: 14,
    reposts: 7,
    imageUrls: [
      "https://picsum.photos/400/300?random=2",
      "https://picsum.photos/400/300?random=3",
    ],
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "정수진",
      profileImageUrl: "https://i.pravatar.cc/150?img=4",
      isVerified: false,
    },
    content:
      "오늘 읽은 책에서 인상 깊었던 구절: '성공은 준비와 기회가 만나는 곳에서 탄생한다'",
    timeAgo: "3시간 전",
    likes: 256,
    comments: 31,
    reposts: 45,
  },
  {
    id: "5",
    user: {
      id: "user5",
      name: "최동현",
      profileImageUrl: "https://i.pravatar.cc/150?img=5",
      isVerified: true,
    },
    content: "운동 루틴 공유합니다! 꾸준히 하는 게 제일 중요해요 💪",
    timeAgo: "5시간 전",
    likes: 342,
    comments: 67,
    reposts: 28,
    imageUrls: ["https://picsum.photos/400/300?random=4"],
  },
];

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.get("/posts", (schema, request) => {
        const cursor = request.queryParams?.cursor;
        if (cursor) {
          const cursorIndex = dummyPosts.findIndex((p) => p.id === cursor);
          if (cursorIndex === -1 || cursorIndex >= dummyPosts.length - 1) {
            return { posts: [] };
          }
          return { posts: dummyPosts.slice(cursorIndex + 1) };
        }
        return { posts: dummyPosts };
      });

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
