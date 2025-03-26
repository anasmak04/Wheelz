import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {MenubarModule} from "primeng/menubar";
import {PanelMenuModule} from "primeng/panelmenu";
import {SidebarModule} from "primeng/sidebar";
import { HeaderComponent } from './components/header/header.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";

@NgModule({
  declarations: [

    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenubarModule,
    ButtonModule,
    TableModule,
    SidebarModule,
    PanelMenuModule,
    ButtonModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    MessageModule,
    ConfirmDialogModule,
    TagModule,
    ToastModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  exports : [
    SidebarComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
