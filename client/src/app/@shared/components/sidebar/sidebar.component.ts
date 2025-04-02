import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeMenu();
    this.setupActiveItemTracking();
  }

  private initializeMenu(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/admin/dashboard']
      },
      {
        label: 'Content',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Posts',
            icon: 'pi pi-list',
            routerLink: ['/admin/posts']
          },
          {
            label: 'Categories',
            icon: 'pi pi-tags',
            routerLink: ['/admin/categories']
          },
          {
            label: 'Media',
            icon: 'pi pi-images',
            routerLink: ['/admin/media']
          }
        ]
      },
      {
        label: 'Users',
        icon: 'pi pi-users',
        items: [
          {
            label: 'All Users',
            icon: 'pi pi-user',
            routerLink: ['/admin/users']
          },
          {
            label: 'Roles',
            icon: 'pi pi-shield',
            routerLink: ['/admin/roles']
          }
        ]
      },
      {
        label: 'Comments',
        icon: 'pi pi-comments',
        routerLink: ['/admin/comments']
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'General',
            icon: 'pi pi-sliders-h',
            routerLink: ['/admin/settings/general']
          },
          {
            label: 'Appearance',
            icon: 'pi pi-palette',
            routerLink: ['/admin/settings/appearance']
          },
          {
            label: 'SEO',
            icon: 'pi pi-chart-line',
            routerLink: ['/admin/settings/seo']
          }
        ]
      },
      {
        label: 'Analytics',
        icon: 'pi pi-chart-bar',
        routerLink: ['/admin/analytics']
      }
    ];
  }

  private setupActiveItemTracking(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveMenuItems(this.items);
      });

    this.updateActiveMenuItems(this.items);
  }

  private updateActiveMenuItems(items: MenuItem[]): void {
    const currentUrl = this.router.url;

    items.forEach(item => {
      if (item.routerLink && this.router.url.includes(item.routerLink[0])) {
        item.expanded = true;
        item.styleClass = 'active-menuitem';
      } else {
        item.styleClass = '';
      }

      if (item.items) {
        this.updateActiveMenuItems(item.items);

        const hasActiveChild = item.items.some(
          child => child.styleClass === 'active-menuitem'
        );

        if (hasActiveChild) {
          item.expanded = true;
        }
      }
    });
  }
}
