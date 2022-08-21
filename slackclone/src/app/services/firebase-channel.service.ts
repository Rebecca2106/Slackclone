import { Injectable } from '@angular/core';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireauthService } from '../services/fireauth.service';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FirebaseMainService } from 'src/app/services/firebase-main.service';
import { environment } from 'src/environments/environment';
import { Channel } from 'src/models/channel.class';
import { TestBed } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class FirebaseChannelService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  channelCollection = [];
  channelDetails = new Channel;
  showedMembers: Array<any> = [];

  constructor(public fb: FirebaseMainService, private firestore: AngularFirestore, public fs: FireauthService) { }


  subscribeChannels() {
    this.firestore
      .collection('channels', ref => ref.orderBy("title"))
      .valueChanges({ idField: 'docID' })
      .subscribe((channels: any) => {
        this.channelCollection = channels;
        this.channelCollection = this.filterChannelByUid();
      })
  }

  filterChannelByUid() {
    return this.channelCollection.filter(d => d.members.some(e => e.uid == this.fs.user.uid));
  }

  getChannelforDocID(id) {
    this.firestore
      .collection('channels')
      .doc(id)
      .valueChanges()
      .subscribe((channel: any) => {
        console.log('channel', channel);
        this.channelDetails = channel;
        console.log('Members', channel.members);

        channel.members.forEach(async e => {
          console.log('Member-ID', e.uid);
          let result = await this.fb.getUserFromId(e.uid);
          console.log("ich will das result", result);
        })

      });
  }

}