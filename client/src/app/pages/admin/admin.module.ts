import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ManagePostsComponent } from './manage-posts/manage-posts.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import { ManageTagsComponent } from './manage-tags/manage-tags.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { HomeComponent } from './home/home.component';
import {MenubarModule} from "primeng/menubar";
import {PanelMenuModule} from "primeng/panelmenu";
import {SidebarModule} from "primeng/sidebar";
import {SharedModule} from "../../@shared/shared.module";
import { CreatePostComponent } from './create-post/create-post.component';

@NgModule({
  declarations: [
    ManageUsersComponent,
    ManagePostsComponent,
    ManageTagsComponent,
    ManageCategoriesComponent,
    HomeComponent,
    CreatePostComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MenubarModule,
    ButtonModule,
    TableModule,
    SidebarModule,
    PanelMenuModule,
    SharedModule,
    ButtonModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    MessageModule,
    ConfirmDialogModule,
    TagModule,
    ToastModule,
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class AdminModule { }
