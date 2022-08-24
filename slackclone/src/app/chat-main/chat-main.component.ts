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
    this.showUploadSpinner();
    // this.isUploading = true;
    // this.createUniquefilepathID(event);
    // const file = event.target.files[0];    
    // const filePath = `message_images/${this.filepathID}_msgimage`;
    // const fileRef = this.storage.ref(filePath);
    // const task = this.storage.upload(filePath, file);

    // // get notified when the download URL is available
    // task.snapshotChanges().pipe(
    //   finalize(() => { // Execute when the observable completes
    //     fileRef.getDownloadURL().subscribe(downloadURL => {
    //       this.messageImages.push(downloadURL);
    //       this.currentUploadImage = downloadURL;
    //       console.log('messageImages', this.messageImages);
    //       this.isUploading = false;
    //     });
    //   })
    // ).subscribe(); 
  };

  showUploadSpinner() {
    console.log(this.noteText);
    let spinnerCode = `<p><img src="https://icon-library.com/images/loading-icon-animated-gif/loading-icon-animated-gif-19.jpg" alt="" width="117" height="87"></p>`;
    if(!this.noteText) {
      this.noteText = '';
    }
    let newContent = `${this.noteText}${spinnerCode}`;
    console.log(newContent);

    this.setContentToEditor(newContent);
  }

  sendMsg() {
    console.log(this.noteText);
    // do something else...
    this.setContentToEditor(''); //clear input
  }

  setContentToEditor(data: string) {
    tinymce.activeEditor.setContent(data, { format: 'html' });
  }

}
