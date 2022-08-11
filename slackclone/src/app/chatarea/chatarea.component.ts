import { Component, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';

@Component({
  selector: 'app-chatarea',
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.scss']
})
export class ChatareaComponent implements OnInit {

  constructor(public uiService: UiChangeService) { 
  }

  ngOnInit(): void {
  }

}
