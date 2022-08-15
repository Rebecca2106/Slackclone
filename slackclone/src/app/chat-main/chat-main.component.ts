import { Component, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})
export class ChatMainComponent implements OnInit {

  constructor(public uiService: UiChangeService) { 
  }

  ngOnInit(): void {
  }
 

}
