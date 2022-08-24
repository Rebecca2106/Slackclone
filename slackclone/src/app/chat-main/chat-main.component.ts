import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Message } from 'src/models/message.class';
import { FireauthService } from '../services/fireauth.service';
import { UiChangeService } from '../services/ui-change.service';
import { finalize } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import tinymce from 'dist/slackclone/tinymce/tinymce';
import { TransactionResult } from '@angular/fire/database';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})
export class ChatMainComponent implements OnInit {

  message: Message;
  messageImages = [];
  filepathID: string;
  isUploading: boolean = false;
  noteText: string;
  noteTextSaved: string;
  newContent = "";
  currentUploadImage: string;

  constructor(public uiService: UiChangeService, private storage: AngularFireStorage, public fs: FireauthService, private firestore: AngularFirestore) {
  }

  ngOnInit(): void {
  }

  getContentOfEditor() {
    console.log(this.noteText);
  }

  createUniquefilepathID(event) {
    this.filepathID = `${event.timeStamp}${event.target.files[0].size}`;
    this.filepathID = this.filepathID.replaceAll('.', '');
  }

  upload(event: any) {
    this.isUploading = true;
    this.showUploadSpinner(this.isUploading);
    this.createUniquefilepathID(event);
    const file = event.target.files[0];
    const filePath = `message_images/${this.filepathID}_msgimage`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => { // Execute when the observable completes
        fileRef.getDownloadURL().subscribe(downloadURL => {
          this.messageImages.push(downloadURL);
          this.currentUploadImage = downloadURL;
          console.log('messageImages', this.messageImages);
          this.isUploading = false;
          this.showUploadSpinner(this.isUploading);
        });
      })
    ).subscribe();
  };

  showUploadSpinner(isUploading: boolean) {
    let newText = "";
   
    if (isUploading) {
      this.noteTextSaved = this.noteText;
      let spinnerCode = `<img src="https://icon-library.com/images/loading-icon-animated-gif/loading-icon-animated-gif-19.jpg" width="117" height="87">`;
      if (!this.noteTextSaved) {
        newText = '';
      } else {
        newText = this.noteTextSaved;
      }
      this.newContent = `${newText}${spinnerCode}`;
    } else {
      if (!this.noteTextSaved) {
        newText = '';
      } else {
        newText = this.noteTextSaved;
      }
      let newTextAppend = `<img src="${this.currentUploadImage}" width="auto" height="62">`;
      this.newContent = `${newText}${newTextAppend}`;
    }
    this.setContentToEditor(this.newContent);
    this.noteText = this.newContent;
  }

  sendMsg() {
    console.log(this.noteText);
    // do something else...
    this.setContentToEditor(''); //clear input
    this.noteText = '';
    tinymce.activeEditor.focus();
  }

  setContentToEditor(data: string) {
    tinymce.activeEditor.setContent(data, { format: 'html' });
    console.log("content set", this.noteText);
  }

}
