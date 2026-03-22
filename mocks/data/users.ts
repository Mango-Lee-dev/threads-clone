import { UserProfile } from "@/src/types";

export const dummyUsers: UserProfile[] = [
  {
    id: "wtlee",
    name: "이우택",
    profileImageUrl: "https://i.pravatar.cc/150?img=10",
    description: "Software Engineer | React Native Developer",
    link: "https://github.com/wtlee",
    showInstagramBadge: true,
    isPrivate: false,
    isVerified: true,
    followersCount: 1234,
    followingCount: 567,
    isFollowing: false,
    isFollowedBy: false,
    isMuted: false,
    isBlocked: false,
    isRestricted: false,
  },
  {
    id: "user1",
    name: "김철수",
    profileImageUrl: "https://i.pravatar.cc/150?img=1",
    description: "디자이너 | UI/UX 전문가 🎨",
    link: "https://design.co",
    showInstagramBadge: true,
    isPrivate: false,
    isVerified: true,
    followersCount: 5678,
    followingCount: 234,
    isFollowing: true,
    isFollowedBy: true,
    isMuted: false,
    isBlocked: false,
    isRestricted: false,
  },
  {
    id: "user2",
    name: "이영희",
    profileImageUrl: "https://i.pravatar.cc/150?img=2",
    description: "프론트엔드 개발자 | TypeScript 💙",
    link: "https://younghee.dev",
    showInstagramBadge: false,
    isPrivate: false,
    isVerified: false,
    followersCount: 890,
    followingCount: 456,
    isFollowing: true,
    isFollowedBy: false,
    isMuted: false,
    isBlocked: false,
    isRestricted: false,
  },
  {
    id: "user3",
    name: "박민수",
    profileImageUrl: "https://i.pravatar.cc/150?img=3",
    description: "백엔드 개발자 | Node.js & Go",
    link: "https://minsu.io",
    showInstagramBadge: true,
    isPrivate: false,
    isVerified: true,
    followersCount: 3456,
    followingCount: 123,
    isFollowing: false,
    isFollowedBy: true,
    isMuted: false,
    isBlocked: false,
    isRestricted: false,
  },
  {
    id: "user4",
    name: "최지우",
    profileImageUrl: "https://i.pravatar.cc/150?img=4",
    description: "PM | 스타트업 🚀",
    showInstagramBadge: false,
    isPrivate: true,
    isVerified: false,
    followersCount: 234,
    followingCount: 567,
    isFollowing: false,
    isFollowedBy: false,
    isMuted: false,
    isBlocked: false,
    isRestricted: false,
  },
  {
    id: "user5",
    name: "정수현",
    profileImageUrl: "https://i.pravatar.cc/150?img=5",
    description: "iOS Developer | Swift 🍎",
    link: "https://soohyun.app",
    showInstagramBadge: true,
    isPrivate: false,
    isVerified: false,
    followersCount: 2345,
    followingCount: 890,
    isFollowing: true,
    isFollowedBy: true,
    isMuted: true,
    isBlocked: false,
    isRestricted: false,
  },
];

// 사용자 상태를 관리하는 Map (런타임에 변경 가능)
export const userStates = new Map<string, {
  isFollowing: boolean;
  isMuted: boolean;
  isBlocked: boolean;
  isRestricted: boolean;
  followersCount: number;
}>();

// 초기 상태 설정
dummyUsers.forEach(user => {
  userStates.set(user.id, {
    isFollowing: user.isFollowing,
    isMuted: user.isMuted,
    isBlocked: user.isBlocked,
    isRestricted: user.isRestricted,
    followersCount: user.followersCount,
  });
});
