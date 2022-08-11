import { Component, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';

@Component({
  selector: 'app-chatarea',
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.scss']
})
export class ChatareaComponent implements OnInit {
  sidebarWidth = 300;
  resizing = false;
  currentXPosition = 0;
  constructor(public uiService: UiChangeService) { 
  }

  ngOnInit(): void {
  }

  startResize(event){
    this.resizing = true;
    this.currentXPosition = event.clientX;
  }

  onResizing(event){
    if(this.resizing){
    this.sidebarWidth += event.clientX - this.currentXPosition;
    this.currentXPosition = event.clientX;
    console.log(event.clientY);
    }
  }
  

}
