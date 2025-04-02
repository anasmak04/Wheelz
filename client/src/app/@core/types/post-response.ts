import {User} from "./user";
import {PostStatus} from "./enums/post-status";

export interface PostResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  status: PostStatus;
  author: User;
  createdAt: string;
  publishedAt: string | null;
  updatedAt: string;
}
