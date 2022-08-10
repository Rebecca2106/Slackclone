import { Component, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  
  constructor(public uiService: UiChangeService) { }

  ngOnInit(): void {

  }
  
}
