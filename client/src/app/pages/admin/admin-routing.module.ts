import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage-users', pathMatch: 'full' },
  { path: 'manage-users', component: ManageUsersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
