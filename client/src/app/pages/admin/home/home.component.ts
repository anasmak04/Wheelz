import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import {AuthService} from "../../../@core/services/auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isAdmin = false;
  menuItems: MenuItem[] = [];
  adminMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    this.isAdmin = user?.role === 'ADMIN';

    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: this.isAdmin ? '/admin/dashboard' : '/user/home'
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: '/profile'
      }
    ];

    if (this.isAdmin) {
      this.adminMenuItems = [
        { label: 'Users', icon: 'pi pi-users', routerLink: '/admin/manage-users' },
        { label: 'Posts', icon: 'pi pi-pencil', routerLink: '/admin/manage-posts' },
        { label: 'Categories', icon: 'pi pi-folder-open', routerLink: '/admin/manage-categories' },
        { label: 'Tags', icon: 'pi pi-tags', routerLink: '/admin/manage-tags' },
        { label: 'Reports', icon: 'pi pi-chart-line', routerLink: '/admin/reports' }
      ];

    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
