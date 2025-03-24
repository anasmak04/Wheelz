import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    ManageUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
