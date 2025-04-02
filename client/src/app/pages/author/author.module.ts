import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthorRoutingModule} from "./author-routing.module";
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { TagCreateComponent } from './tag/tag-create/tag-create.component';
import { TagListComponent } from './tag/tag-list/tag-list.component';

@NgModule({
  declarations: [
    PostCreateComponent,
         PostListComponent,
         CategoryCreateComponent,
         CategoryListComponent,
         TagCreateComponent,
         TagListComponent
  ],
  imports: [
    CommonModule,
    AuthorRoutingModule
  ]
})
export class AuthorModule { }
