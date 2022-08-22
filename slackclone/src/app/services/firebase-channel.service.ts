import { Injectable } from '@angular/core';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireauthService } from '../services/fireauth.service';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FirebaseMainService } from 'src/app/services/firebase-main.service';
import { environment } from 'src/environments/environment';
import { Channel } from 'src/models/channel.class';
import { take} from 'rxjs';

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
    return new Promise(async resolve => {
    this.firestore
      .collection('channels')
      .doc(id)
      .valueChanges().pipe(take(1))
      .subscribe((channel: any) => {
        this.showedMembers = [];
        this.channelDetails = channel;
        channel.members.forEach(async e => {
          // console.log('Member-ID', e.uid);
          let result = await this.fb.getUserFromId(e.uid);
          this.showedMembers.push(result);
        });
        resolve(this.showedMembers); ;
      })
    })
  }

}