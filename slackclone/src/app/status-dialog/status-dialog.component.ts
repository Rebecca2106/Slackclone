import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { FireauthService } from '../services/fireauth.service';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit {
  user: User;
  docID: string;
  typesOfStates: string[] = ['📅 In a meeting', '🚐 Commuting', '🤒 Out sick', '🌴 Vacationing', '🏡 Working remotely'];
  individualState: string;

  constructor(public dialogRef: MatDialogRef<StatusDialogComponent>, public fs: FireauthService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    if (this.fs.user) {
      let sub = this.firestore
        .collection('users', ref => ref.where('uid', '==', this.fs.user.uid))
        .valueChanges({ idField: 'docID' })
        .subscribe((user: any) => {
          this.docID = user[0].docID;
          this.user = new User(user[0]);
          this.individualState = this.user.statusText;
          sub.unsubscribe();         
        })
    }
  }

  getStatus(option) {
    if (option == 'customOption') {
      this.user.statusText = this.individualState;
    } else {
      this.user.statusText = option;
    }
    this.saveStatus();
  }

  saveStatus() {
    this.firestore
      .collection('users')
      .doc(this.docID)
      .update({"statusText": this.user.statusText})
      .then(() => {
        this.dialogRef.close();
      })
  }

}
