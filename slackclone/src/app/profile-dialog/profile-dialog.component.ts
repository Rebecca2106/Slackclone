import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { FireauthService } from '../services/fireauth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  user: User;
  docID: string;
  isUploading: boolean = false;
  uploadPercent: Observable<number>;

  constructor(public fs: FireauthService, private firestore: AngularFirestore, public dialogRef: MatDialogRef<ProfileDialogComponent>, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    if (this.fs.user) {
      let sub = this.firestore
        .collection('users', ref => ref.where('uid', '==', this.fs.user.uid))
        .valueChanges({ idField: 'docID' })
        .subscribe((user: any) => {
          this.docID = user[0].docID;
          this.user = new User(user[0]);
          sub.unsubscribe();
        })
    }
  }

  saveProfile() {
    this.firestore
      .collection('users')
      .doc(this.docID)
      .update(this.user.toJSON())
      .then(() => {
          this.dialogRef.close();
      })
  }

  upload(event: any) {
    this.isUploading = true;
    const file = event.target.files[0];
    const filePath = `user_images/${this.fs.user.uid}_profileimage`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => { // Execute when the observable completes
        fileRef.getDownloadURL().subscribe(downloadURL => {
          this.user.image = downloadURL;
          this.isUploading = false;
        });
      })
    ).subscribe();
  };

  deleteImage() {
    const filePath = this.user.image;
    const fileRef = this.storage.refFromURL(filePath);

    fileRef.delete().pipe(
      finalize(() => { // Execute when the observable completes
        this.user.image = '';
        this.saveImage();
      })
    ).subscribe();
  }

  saveImage() {
    this.firestore
      .collection('users')
      .doc(this.docID)
      .update({ "image": '' });
  }

}


