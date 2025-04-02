import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from "../../../@core/services/admin/post/post.service";
import { PostResponse } from "../../../@core/types/post-response";
import { Router, NavigationEnd } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ManagePostsComponent implements OnInit {
  posts: PostResponse[] = [];
  loading: boolean = false;
  error: string | null = null;
  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private router: Router,
    private postService: PostService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Current route:', event.url);
      }
    });
  }

  ngOnInit(): void {
    this.loadAllPosts();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.dt?.filterGlobal(target.value, 'contains');
  }

  confirmDelete(post: PostResponse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${post.title}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePost(post.id);
      }
    });
  }

  deletePost(id: number): void {
    this.postService.deletePost(id).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Post deleted successfully'
        });
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete post'
        });
      }
    });
  }

  loadAllPosts(): void {
    this.loading = true;
    this.error = null;
    console.log("Starting to load posts...");

    this.postService.getAllPosts().subscribe({
      next: (data) => {
        console.log('Posts loaded successfully:', data);
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.error = 'Failed to load posts. Please try again later.';
        this.loading = false;
      },
      complete: () => {
        console.log('Posts loading completed');
      }
    });
  }
  getStatusSeverity(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'success';
      case 'DRAFT': return 'warning';
      case 'SCHEDULED': return 'info';
      case 'PENDING': return 'info';
      case 'ARCHIVED': return 'secondary';
      default: return 'info';
    }
  }

  formatStatusLabel(status: string): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  createNewPost(): void {
    this.router.navigate(['/admin/create-post']);
  }
}
