import { Component, OnInit } from '@angular/core';
import {User} from "../../../@core/types/user";
import {UserService} from "../../../@core/services/admin/user/user.service";


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;
  error: string | null = null;
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.page, this.size).subscribe({
      next: (data) => {
        this.users = data.content;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error fetching users!';
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteUser(userId?: number): void {
    if (!userId) return;
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
        },
        error: (err) => {
          this.error = 'Failed to delete user!';
          console.error(err);
        }
      });
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchUsers();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.fetchUsers();
    }
  }
}
