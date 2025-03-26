import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostResponse} from "../../../types/post-response";
import {environment} from "../../../../../environments/environement.prod";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http : HttpClient) { }

  getAllPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(
      `${environment.apiUrl}${environment.posts.getAll}`
    );
  }
}
