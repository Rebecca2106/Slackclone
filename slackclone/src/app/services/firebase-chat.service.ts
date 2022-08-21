import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireauthService } from '../services/fireauth.service';
import { DM } from 'src/models/dm.class';
import firebase from 'firebase/compat/app';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FirebaseMainService } from 'src/app/services/firebase-main.service';

// import firebase from 'firebase/app';







@Injectable({
    providedIn: 'root'
})
export class FirebaseChatService {
    dmCollection: Array<any>;
    chat: DM;

    constructor(public fb: FirebaseMainService ,private firestore: AngularFirestore, public fs: FireauthService) { }



    ngOnInit(): void {
    }

    async subscribeChats() {
        this.firestore
            .collection( 'dms', ref => ref.where("memberUids", "array-contains", this.fs.user.uid))
            .valueChanges()
            .subscribe((dms: any) => {

                this.dmCollection = dms.sort( this.compare );
                console.log('dms', this.dmCollection);
            })
    }

    compare(a, b) {
        if (a.members.uid < b.members.uid) {
            return -1;
        }
        if (a.members.uid > b.members.uid) {
            return 1;
        }
        return 0;
    }


    createNewMemebersList(otherUIds) {
        let timestamp = firebase.firestore.FieldValue.serverTimestamp();
        this.chat.members = [
            { "uid": this.fs.uid, "read": false, "last_updated": timestamp, "viewed_messages": 0 }
        ];

        otherUIds.forEach(element => {
            this.chat.members.push({ "uid": element, "read": false, "last_updated": timestamp, "viewed_messages": 0 });
        });
    }

    setDMValues(otherUIds) {
        this.createNewMemebersList(otherUIds);
    }


    saveDM() {
        this.firestore
            .collection('dms')
            .add(this.chat.toJSON())
            .then(() => {
                console.log('Chat created.');
            })
            .catch(() => {
                console.log('Error while saving Chat.');
            });
    }
}

