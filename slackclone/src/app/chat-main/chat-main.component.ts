import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Message } from 'src/models/message.class';
import { FireauthService } from '../services/fireauth.service';
import { UiChangeService } from '../services/ui-change.service';
import { finalize, timestamp } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import firebase from 'firebase/compat/app';
import { FirebaseChatService } from 'src/app/services/firebase-chat.service';
import { FirebaseChannelService } from 'src/app/services/firebase-channel.service';
import tinymce from 'node_modules/tinymce';
import { serverTimestamp } from "firebase/firestore";
import { TransactionResult } from '@angular/fire/database';
import { FirebaseChannelChatThreadService } from 'src/app/services/firebase-channel-chat-thread.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseMainService } from '../services/firebase-main.service';

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
  newContent = "";
  currentUploadImage: string;
  uploadData = "";

  constructor(public fsMain: FirebaseMainService ,public sanitizer: DomSanitizer, public fcctService: FirebaseChannelChatThreadService, public channelService: FirebaseChannelService, public chatService: FirebaseChatService, public uiService: UiChangeService, private storage: AngularFireStorage, public fs: FireauthService, private firestore: AngularFirestore, public fb: FirebaseMainService) {
  }

  getTest(){
    return this.messageImages.length != 0
  }

  ngOnInit(): void {
  }

  logChange() {
    console.log(this.noteText);
  }

  createUniquefilepathID(event) {
    this.filepathID = `${event.timeStamp}${event.target.files[0].size}`;
    this.filepathID = this.filepathID.replaceAll('.', '');
  }

  upload(event: any) {
    this.isUploading = true;
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
        });
      })
    ).subscribe();
  };

  clearInput() {
    this.uploadData = '';
    this.noteText = '';
    this.newContent = '';
    this.messageImages = [];
    this.setContentToEditor(''); //clear input
    tinymce.activeEditor.focus();
  }

  setContentToEditor(data: string) {
    tinymce.activeEditor.setContent(data, { format: 'html' });
  }

  addMessage() {
    console.log('dd');
    if (this.fcctService.midContent.type == 'chat' || this.fcctService.midContent.type == 'channel') {

      let message = new Message();
      message.timestamp = firebase.firestore.Timestamp.now();
      message.creator = this.fs.user.uid;
      message.message = this.noteText;
      message.images = this.messageImages;
      this.fcctService.midContent.messages.push(message.toJSON());

      if (this.fcctService.midContent.type == 'channel') {
        this.channelService.updateChannelMessages(this.fcctService.midContent.docID, this.fcctService.midContent.messages);
      } else {
        this.chatService.updateChatMessages(this.fcctService.midContent.docID, this.fcctService.midContent.messages);
      }
      this.clearInput();
    }

  }

  deleteImg(i) {
    let imagePath = this.messageImages[i];
    this.deleteImgFromFB(imagePath, i);
  }

  
  deleteImgFromFB(path, i) {
    const filePath = path   
    const fileRef = this.storage.refFromURL(filePath);

    fileRef.delete().pipe(
      finalize(() => { // Execute when the observable completes
        this.messageImages.splice(i,1);
      })
      ).subscribe();
  }
}
