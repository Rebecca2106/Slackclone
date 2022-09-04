import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { UiChangeService } from './ui-change.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseChannelChatThreadService {

  constructor(private firestore: AngularFirestore , public uiService: UiChangeService) { }

  currentThreadMessage;

  rightContent = {
    docID: "",
    header: "",
    type: "",
    messages: [],
    msgTimeStamp: {
      seconds : 0,
      nanoseconds: 0
    }
  }

  openThread(timestamp){
    this.rightContent.msgTimeStamp = timestamp;
    this.rightContent.docID = this.midContent.docID;
    this.rightContent.type = this.midContent.type;
    this.setHeaderThread(this.rightContent.type, "");
    this.initThreadMessages(timestamp);
    this.uiService.openThread();
  }

  setHeaderThread(type, mainline){
      this.rightContent.header = `${type}-Thread ${mainline}`;
  }

  initThreadMessages(timestamp){
    let resultMessage = this.midContent.messages.filter(msg => msg.timestamp == timestamp);
    this.rightContent.messages = resultMessage[0].thread;
    this.currentThreadMessage = resultMessage[0];
  }

  updateThreadMessages(messages){ 
    let resultMessage = messages.filter(msg => msg.timestamp.seconds == this.rightContent.msgTimeStamp.seconds && msg.timestamp.nanoseconds == this.rightContent.msgTimeStamp.nanoseconds);
    this.rightContent.messages = resultMessage[0].thread;
    this.currentThreadMessage = resultMessage[0];
  }

  currentChatChannel;

  midContent = {
    docID: "",
    header: "",
    type: "",
    messages: [],
    members:[],
  }

  openChat(chat){
    if(this.uiService.handyMode) {
      this.uiService.toggleSidebar();
    }
    this.currentChatChannel = chat;
    this.midContent.members = chat.members;
    this.setContent(chat.docID, "chat", chat.messages);
    this.setHeader(chat.docID);
  }

  openChannel(channel){
    this.currentChatChannel = channel;
    this.setContent(channel.docID, "channel", channel.messages);
    this.setHeader(channel.title);
  }

  setHeader(mainline){
      this.midContent.header = `${mainline}`;
  }

  setContent(docID, type, messages){
    this.midContent.docID = docID;
    this.midContent.type = type;
    this.midContent.messages = messages;
  }


}