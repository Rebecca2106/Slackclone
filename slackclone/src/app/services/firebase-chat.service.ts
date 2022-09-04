import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireauthService } from '../services/fireauth.service';
import { DM } from 'src/models/dm.class';
import firebase from 'firebase/compat/app';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { UiChangeService } from '../services/ui-change.service';
import { FirebaseMainService } from 'src/app/services/firebase-main.service';
import { FirebaseChannelChatThreadService } from 'src/app/services/firebase-channel-chat-thread.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseChatService {
    dmCollection: Array<any>;
    chat: DM;

    constructor(public fcctService: FirebaseChannelChatThreadService, public fb: FirebaseMainService, private firestore: AngularFirestore, public fs: FireauthService) { }

    ngOnInit(): void {
    }

    async subscribeChats() {
        this.firestore
            .collection('dms', ref => ref.where("memberUids", "array-contains", this.fs.user.uid))
            .valueChanges({ idField: 'docID' })
            .subscribe((dms: any) => {
                this.dmCollection = dms.sort(this.compare);
                this.updateOpenChat();
                this.updateOpenChatThread();
            })
    }

    updateOpenChatThread(){
        if (this.fcctService.rightContent.type == 'chat') {
            this.dmCollection.forEach(chat => {
                if (this.fcctService.rightContent.docID == chat.docID) {
                    this.fcctService.updateThreadMessages(chat.messages)
                }
            });
        } 
    }

    updateOpenChat() {
        if (this.fcctService.midContent.type == 'chat') {
            this.dmCollection.forEach(chat => {
                if (this.fcctService.midContent.docID == chat.docID) {
                    this.fcctService.setContent(chat.docID, "chat", chat.messages);
                }
            });
        }  
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
                // console.log('Chat created.');
            })
            .catch(() => {
                console.log('Error while saving Chat.');
            });
    }

    deleteDM(id) {
        this.firestore
            .collection('dms')
            .doc(id)
            .delete()
            .then(() => {
                // console.log('Chat deleted.');
            })
            .catch(() => {
                console.log('Error while deleting chat.');
            });
    }

    updateChatMessages(docID, messages) {
        let docRef = this.firestore.collection('dms').doc(docID);
        docRef.update({
            messages: messages
        });
    }

    updateChatThreadMessages(timeStamp, docID, messages) {

        let resultChannel = this.dmCollection.filter(channel => channel.docID == docID)[0];
        let resultMsgindex = resultChannel.messages.findIndex(msg => this.validateMessage(msg, timeStamp));
        resultChannel.messages[resultMsgindex].thread = messages;
        this.updateChatMessages(docID, resultChannel.messages)
    }

    validateMessage(msg, timeStamp) {
        return msg.timestamp.toMillis() == timeStamp.toMillis();
    }
}

