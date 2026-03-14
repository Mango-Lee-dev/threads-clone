export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    profileImageUrl: string;
    isVerified?: boolean;
  };
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  reposts: number;
  imageUrls?: string[];
  link?: string;
  linkThumbnail?: string;
  location?: [number, number];
}
