import { Component, OnInit } from '@angular/core';
import { FireauthService } from 'src/services/fireauth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public fs: FireauthService) {
  }

  ngOnInit(): void {
  }

  toggleSidebar() {
    console.log('test');
  }

}
