import {PostStatus} from "./enums/post-status";

export interface PostRequest{
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: PostStatus;
}
