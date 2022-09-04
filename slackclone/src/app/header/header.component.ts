import { Component, OnInit } from '@angular/core';
import { FireauthService } from '../services/fireauth.service';
import { UiChangeService } from '../services/ui-change.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  docID: string;

  constructor(public uiService: UiChangeService, public fs: FireauthService, private firestore: AngularFirestore, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openStateDialog() {
    const dialog = this.dialog.open(StatusDialogComponent);
  }

  connectFB() {
    if (this.fs.user) {
      let sub = this.firestore
        .collection('users', ref => ref.where('uid', '==', this.fs.user.uid))
        .valueChanges({ idField: 'docID' })
        .subscribe((user: any) => {
          this.docID = user[0].docID;         
          sub.unsubscribe();
        })
    }
  }

  toggleOnlineState() {
    if (this.docID) {
      this.fs.user.onlineState = !this.fs.user.onlineState;
      this.fs.updateUser();
    }
  }
}
