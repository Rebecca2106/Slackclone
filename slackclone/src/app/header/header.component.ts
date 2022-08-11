import { Component, OnInit } from '@angular/core';
import { FireauthService } from '../services/fireauth.service';
import { UiChangeService } from '../services/ui-change.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public uiService: UiChangeService, public fs: FireauthService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  
  openDialog() {
    const dialogRef = this.dialog.open(ProfileDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
