import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss']
})
export class AddChannelComponent implements OnInit {
  Channel_name: string ='';

  constructor() { }

  ngOnInit(): void {
  }

}
