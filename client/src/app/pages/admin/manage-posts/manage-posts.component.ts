import { Component, OnInit } from '@angular/core';
import { PostService } from "../../../@core/services/admin/post/post.service";
import {PostResponse} from "../../../@core/types/post-response";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.scss']
})
export class ManagePostsComponent implements OnInit {
  posts: PostResponse[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private router: Router,
              private postService : PostService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Current route:', event.url);
      }
    })};

  ngOnInit(): void {
    this.loadAllPosts();
  }

  confirmDelete(post: PostResponse): void {

  }

  deletePost(id: number): void {

  }
  loadAllPosts(): void {
    this.loading = true;
    this.error = null;

    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.error = 'Failed to load posts. Please try again later.';
        this.loading = false;
      }
    });
  }
}
