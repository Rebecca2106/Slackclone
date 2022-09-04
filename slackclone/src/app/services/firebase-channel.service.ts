import { Injectable } from '@angular/core';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireauthService } from '../services/fireauth.service';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FirebaseMainService } from 'src/app/services/firebase-main.service';
import { environment } from 'src/environments/environment';
import { Channel } from 'src/models/channel.class';
import { take } from 'rxjs';
import { UiChangeService } from '../services/ui-change.service';
import { FirebaseChannelChatThreadService } from 'src/app/services/firebase-channel-chat-thread.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseChannelService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  channelCollection = [];
  channelDetails = new Channel;
  showedMembers: Array<any> = [];

  constructor(public fcctService: FirebaseChannelChatThreadService, public fb: FirebaseMainService, private firestore: AngularFirestore, public fs: FireauthService) { }


  subscribeChannels() {
    this.firestore
      .collection('channels', ref => ref.orderBy("title"))
      .valueChanges({ idField: 'docID' })
      .subscribe((channels: any) => {
        this.channelCollection = channels;
        this.channelCollection = this.filterChannelByUid();
        this.updateOpenChannel();
        this.updateOpenChatThread();
      })
  }

  updateOpenChatThread(){
    if (this.fcctService.rightContent.type == 'channel') {
        this.channelCollection.forEach(channel => {
            if (this.fcctService.rightContent.docID == channel.docID) {
                this.fcctService.updateThreadMessages(channel.messages)
            }
        });
    } 
}

  filterChannelByUid() {
    return this.channelCollection.filter(d => d.members.some(e => e.uid == this.fs.user.uid));
  }

  getChannelforDocID(id) {
    return new Promise(async resolve => {
      this.firestore
        .collection('channels')
        .doc(id)
        .valueChanges().pipe(take(1))
        .subscribe((channel: any) => {
          this.showedMembers = [];
          this.channelDetails = channel;
          channel.members.forEach(async e => {
            let result = await this.fb.getUserFromId(e.uid);
            this.showedMembers.push(result);
          });
          resolve(this.showedMembers);
        })
    })
  }

  updateOpenChannel() {
    if (this.fcctService.midContent.type == 'channel') {
      this.channelCollection.forEach(channel => {
        if (this.fcctService.midContent.docID == channel.docID) {
          this.fcctService.setContent(channel.docID, "channel", channel.messages);
        }
      });
    }
  }

  updateChannelMessages(docID, messages) {
    let docRef = this.firestore.collection('channels').doc(docID);
    docRef.update({
      messages: messages
    });
  }
  
  updateChannelThreadMessages(timeStamp, docID, messages){

    let resultChannel = this.channelCollection.filter(channel => channel.docID == docID)[0];
    let resultMsgindex = resultChannel.messages.findIndex(msg => this.validateMessage(msg, timeStamp));
    resultChannel.messages[resultMsgindex].thread = messages;
    this.updateChannelMessages(docID, resultChannel.messages)
  }

  validateMessage(msg, timeStamp){
    return msg.timestamp.toMillis() == timeStamp.toMillis();
  }
}