import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { FireauthService } from '../services/fireauth.service';


@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  user: User;
  userSub: any;
  docID: string;

  constructor(public fs: FireauthService, private firestore: AngularFirestore, public dialogRef: MatDialogRef<ProfileDialogComponent>) { }

  ngOnInit(): void {
    if (this.fs.user) {
      this.userSub = this.firestore
        .collection('users', ref => ref.where('uid', '==', this.fs.uid))
        .valueChanges({ idField: 'docID' })
        .subscribe((user: any) => {
          this.docID = user[0].docID;          
          this.user = new User(user[0]);
        })
      }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  saveProfile() {  
    this.firestore
      .collection('users')
      .doc(this.docID)
      .update(this.user.toJSON())
      .then(() => {
        console.log('Dialog closed');
        this.dialogRef.close();
      })
  }

}


