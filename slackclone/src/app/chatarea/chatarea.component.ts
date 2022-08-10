import { Component, OnInit } from '@angular/core';
import { FireauthService } from 'src/services/fireauth.service';

@Component({
  selector: 'app-chatarea',
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.scss']
})
export class ChatareaComponent implements OnInit {

  constructor(public fs: FireauthService) {
  }

  ngOnInit(): void {
  }

}
