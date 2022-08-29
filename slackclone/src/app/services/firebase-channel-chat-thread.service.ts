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
    msgTimeStamp: 0
  }

  openThread(timestamp){
    this.rightContent.msgTimeStamp = timestamp;
    this.rightContent.docID = this.midContent.docID;
    this.rightContent.type = this.midContent.type;
    this.setHeaderThread(this.rightContent.type, "");
    this.setMessage(timestamp);
    this.uiService.openThread();
  }

  setHeaderThread(type, mainline){
      this.rightContent.header = `${type}-Thread ${mainline}`;
  }

  setMessage(timestamp){
    let result = this.midContent.messages.filter(msg => msg.timestamp == timestamp);
    this.rightContent.messages = result[0].thread;
    this.currentThreadMessage = result[0];
  }



  
  currentChatChannel;

  midContent = {
    docID: "",
    header: "",
    type: "",
    messages: [],

  }

  openChat(chat){
    if(this.uiService.handyMode) {
      this.uiService.toggleSidebar();
    }
    this.currentChatChannel = chat;
    console.log(this.currentChatChannel);
    
    this.setContent(chat.docID, "chat", chat.messages);
    this.setHeader("chat", chat.docID);
  }

  openChannel(channel){
    this.currentChatChannel = channel;
    this.setContent(channel.docID, "channel", channel.messages);
    this.setHeader("channel", channel.docID);
  }

  setHeader(type, mainline){
      this.midContent.header = `${type}: ${mainline}`;
  }

  setContent(docID, type, messages){
    this.midContent.docID = docID;
    this.midContent.type = type;
    this.midContent.messages = messages;
  }


}