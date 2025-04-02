
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../../environments/environement.prod";
import {TagsResponse} from "../../../types/tags-response";
import {TagRequest} from "../../../types/tag-request";

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private baseUrl = `${environment.apiUrl}/api/tags`;

  constructor(private http: HttpClient) {}

  getAllTags(): Observable<TagsResponse[]> {
    return this.http.get<TagsResponse[]>(this.baseUrl);
  }

  getTagById(id: number): Observable<TagsResponse> {
    return this.http.get<TagsResponse>(`${this.baseUrl}/${id}`);
  }

  createTag(tag: TagRequest): Observable<TagsResponse> {
    return this.http.post<TagsResponse>(this.baseUrl, tag);
  }

  updateTag(id: number, tag: TagRequest): Observable<TagsResponse> {
    return this.http.put<TagsResponse>(`${this.baseUrl}/${id}`, tag);
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }



}
