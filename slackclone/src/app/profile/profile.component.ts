import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { FireauthService } from '../services/fireauth.service';
import { UiChangeService } from '../services/ui-change.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public uiService: UiChangeService, public fs: FireauthService, public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  openProfileDialog() {
    const dialog = this.dialog.open(ProfileDialogComponent);
  }

}
