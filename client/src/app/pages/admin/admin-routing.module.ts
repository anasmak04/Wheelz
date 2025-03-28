import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import {PostCreateComponent} from "../author/post/post-create/post-create.component";
import {ManagePostsComponent} from "./manage-posts/manage-posts.component";
import {ManageTagsComponent} from "./manage-tags/manage-tags.component";
import {ManageCategoriesComponent} from "./manage-categories/manage-categories.component";
import {HomeComponent} from "./home/home.component";
import {CreatePostComponent} from "./create-post/create-post.component";

const routes: Routes = [
  { path: '', redirectTo: 'manage-users', pathMatch: 'full' },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'manage-posts', component: ManagePostsComponent },
  { path: 'create-post', component: CreatePostComponent },
  { path: 'manage-tags', component: ManageTagsComponent },
  { path: 'manage-categories', component: ManageCategoriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
