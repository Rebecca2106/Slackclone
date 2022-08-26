import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-design-dialog',
  templateUrl: './design-dialog.component.html',
  styleUrls: ['./design-dialog.component.scss']
})
export class DesignDialogComponent implements OnInit {

  constructor(public myapp: AppComponent, public dialogRef: MatDialogRef<DesignDialogComponent>) { }
  selectedTheme: string = '';

  ngOnInit(): void {
  }

  radioChangeHandler(event: any) {
    console.log(" Value is : ", event.value+'-theme');
    this.selectedTheme=event.value;
    this.myapp.onSetTheme(event.value+'-theme')
  }
}
