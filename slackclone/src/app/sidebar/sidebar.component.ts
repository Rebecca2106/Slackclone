import { Component, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  panelOpenState = true;

  constructor(public uiService: UiChangeService) { }

  ngOnInit(): void {

  }
  
}
