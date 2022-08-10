import { Component, OnInit } from '@angular/core';
import { FireauthService } from '../services/fireauth.service';
import { UiChangeService } from '../services/ui-change.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public uiService: UiChangeService, public fs: FireauthService) {
  }

  ngOnInit(): void {
  }

}
