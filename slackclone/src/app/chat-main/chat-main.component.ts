import { Component, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})
export class ChatMainComponent implements OnInit {
  
  public Editor = ClassicEditor;
    constructor(public uiService: UiChangeService) { 
  }

  ngOnInit(): void {
  }
 

}
