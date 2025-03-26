import {Component, Input} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() items: MenuItem[] = [];

}
