import { Repost } from "@/src/types";
import { dummyPosts, wtleeUser } from "./posts";

export const dummyReposts: Repost[] = [
  {
    id: "repost_1",
    type: "repost",
    user: wtleeUser,
    repostedAt: "30분 전",
    originalPost: dummyPosts.find((p) => p.id === "2")!,
  },
  {
    id: "repost_2",
    type: "repost",
    user: wtleeUser,
    repostedAt: "2시간 전",
    originalPost: dummyPosts.find((p) => p.id === "4")!,
    quoteContent: "이 문구 정말 와닿네요. 개발할 때도 마찬가지인 것 같아요.",
  },
  {
    id: "repost_3",
    type: "repost",
    user: wtleeUser,
    repostedAt: "5시간 전",
    originalPost: dummyPosts.find((p) => p.id === "5")!,
  },
  {
    id: "repost_4",
    type: "repost",
    user: wtleeUser,
    repostedAt: "1일 전",
    originalPost: dummyPosts.find((p) => p.id === "7")!,
    quoteContent: "팀워크의 중요성! 좋은 팀이 좋은 결과를 만든다.",
  },
  {
    id: "repost_5",
    type: "repost",
    user: wtleeUser,
    repostedAt: "2일 전",
    originalPost: dummyPosts.find((p) => p.id === "8")!,
  },
];
