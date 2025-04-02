import {PostStatus} from "./enums/post-status";

export interface PostUpdateRequest{
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  status?: PostStatus;

}
