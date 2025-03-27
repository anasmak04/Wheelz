import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PostResponse } from "../../../types/post-response";
import { environment } from "../../../../../environments/environement.prod";
import {PostUpdateRequest} from "../../../types/post-update-request";
import {PostRequest} from "../../../types/post-request";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = `${environment.apiUrl}/api/posts`;

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<PostResponse[]> {
    console.log('Fetching posts from:', this.baseUrl);

    return this.http.get<any>(this.baseUrl)
      .pipe(
        tap(response => console.log('Raw API response:', response)),
        map(response => {
          // If response is a paginated response with 'content' property
          if (response && response.content) {
            return response.content;
          }
          // If response is already an array
          return response;
        })
      );
  }
  getPostById(id: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.baseUrl}/${id}`);
  }

  getPostBySlug(slug: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.baseUrl}/slug/${slug}`);
  }

  getPublishedPosts(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/published`, { params });
  }

  getPostsByAuthor(authorId: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/author/${authorId}`, { params });
  }

  searchPosts(keyword: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }

  createPost(postData: PostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.baseUrl, postData);
  }

  updatePost(id: number, postData: PostUpdateRequest): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.baseUrl}/${id}`, postData);
  }

  updatePostStatus(id: number, status: string): Observable<PostResponse> {
    return this.http.patch<PostResponse>(`${this.baseUrl}/${id}/status?status=${status}`, {});
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPostTags(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${postId}/tags`);
  }

  addTagToPost(postId: number, tagId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${postId}/tags/${tagId}`, {});
  }

  removeTagFromPost(postId: number, tagId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${postId}/tags/${tagId}`);
  }

  setFeaturedImage(postId: number, mediaId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${postId}/featured-image/${mediaId}`, {});
  }
}
