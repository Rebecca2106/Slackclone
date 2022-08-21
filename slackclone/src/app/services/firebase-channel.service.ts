import { Injectable } from '@angular/core';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireauthService } from '../services/fireauth.service';
import { DM } from 'src/models/dm.class';
import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FirebaseMainService } from 'src/app/services/firebase-main.service';



@Injectable({
  providedIn: 'root'
})
export class FirebaseChannelService {


  channelCollection = [];

  constructor(public fb: FirebaseMainService, private firestore: AngularFirestore, public fs: FireauthService) { }


  subscribeChannels() {
    this.firestore
      .collection('channels', ref => ref.orderBy("title"))
      .valueChanges()
      .subscribe((channels: any) => {
        this.channelCollection = channels;
        //console.log('channels', this.channelCollection);
        this.channelCollection = this.filterChannelByUid();
      })
  }

  filterChannelByUid() {
    return this.channelCollection.filter(d => d.members.some(e => e.uid == this.fs.user.uid));
  }
}