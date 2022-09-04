import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FireauthService } from '../services/fireauth.service';
import tinymce from 'node_modules/tinymce';
import firebase from 'firebase/compat/app';
import { Message } from 'src/models/message.class';
import { FirebaseChannelChatThreadService } from 'src/app/services/firebase-channel-chat-thread.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseMainService } from '../services/firebase-main.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseChatService } from 'src/app/services/firebase-chat.service';
import { FirebaseChannelService } from 'src/app/services/firebase-channel.service';
import { finalize, timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.scss']
})
export class ChatThreadComponent implements OnInit {

  noteText: string;
  message: Message;
  messageImages = [];
  isUploading: boolean = false;
  newContent = "";
  currentUploadImage: string;
  uploadData = "";
  filepathID: string;
  lastLengthMessages = 0;
  editorLoaded = false;


  constructor(private ref: ChangeDetectorRef, public channelService: FirebaseChannelService, public chatService: FirebaseChatService, public fsMain: FirebaseMainService, public sanitizer: DomSanitizer, public fcctService: FirebaseChannelChatThreadService, public uiService: UiChangeService, private storage: AngularFireStorage, public fs: FireauthService, private firestore: AngularFirestore, public fb: FirebaseMainService) {
  }
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
    this.editorLoaded = true;

  }

  scrollToBottom(): void {

    try {
      if (this.fcctService.rightContent.messages.length > this.lastLengthMessages) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        this.lastLengthMessages = this.fcctService.rightContent.messages.length;
      }
    } catch (err) { }
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
    if (this.fcctService.rightContent.type == 'chat' || this.fcctService.rightContent.type == 'channel') {

      let message = new Message();
      message.timestamp = firebase.firestore.Timestamp.now();
      message.creator = this.fs.user.uid;
      message.message = this.noteText;
      message.images = this.messageImages;
      this.fcctService.rightContent.messages.push(message.toJSON());

      if (this.fcctService.rightContent.type == 'channel') {
        this.channelService.updateChannelThreadMessages(this.fcctService.rightContent.msgTimeStamp, this.fcctService.rightContent.docID, this.fcctService.rightContent.messages);
      } else {
        this.chatService.updateChatThreadMessages(this.fcctService.rightContent.msgTimeStamp, this.fcctService.rightContent.docID, this.fcctService.rightContent.messages);
      }
      this.clearInput();
    }
  }

  deleteImg(i) {
    this.messageImages.splice(i, 1);
  }
}
