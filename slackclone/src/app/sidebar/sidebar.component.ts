import { Component, Input, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  panelOpenState = true;
  @Input() togglePosition;
  iconVisible1 = false;
  iconVisible2 = false;
  

  constructor(public uiService: UiChangeService, public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddChannelComponent, {
      width: '350px',
    });}

    mouseEnter(iconPosition) {
      console.log(iconPosition);
      if (iconPosition=="iconVisible1"){
        this.iconVisible1=true
      }

    else {
        this.iconVisible2=true
      }
    }

    mouseLeave(iconPosition) {
      if (iconPosition=="iconVisible1"){
        this.iconVisible1=false;
      }

      else{
        this.iconVisible2=false;
      }
    }

  ngOnInit(): void {

  }
  
}
