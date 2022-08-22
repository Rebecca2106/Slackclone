import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DM } from 'src/models/dm.class';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FireauthService } from '../services/fireauth.service';
import firebase from 'firebase/compat/app';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FirebaseChatService } from 'src/app/services/firebase-chat.service';
import { FirebaseMainService } from '../services/firebase-main.service';
import { FirebaseChannelService } from '../services/firebase-channel.service';


@Component({
  selector: 'app-add-chat',
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.scss']
})
export class AddChatComponent implements OnInit, OnDestroy {
  chat: DM;
  createdData = {
    uid: this.fs.user.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  membersObj = {};
  separatorKeysCodes: number[] = [ENTER, COMMA];
  memberCtrl = new FormControl('');
  members: Array<any> = [];
  filteredUsers: Array<any> = [];

  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;

  constructor(private firestore: AngularFirestore, public dialogRef: MatDialogRef<AddChatComponent>, public chatService: FirebaseChatService, public fs: FireauthService, public fb: FirebaseMainService, public channelService: FirebaseChannelService) {

  }

  ngOnInit(): void {
    this.fb.getAllUsersOrderedByFullname();
  }

  ngOnDestroy(): void {
    this.channelService.showedMembers = [];
  }

  startSearch(e?) {
    let filterValue = '';

    if (e) {
      filterValue = e.toLowerCase();
    }
    this.filteredUsers = this.fb.allmembers.filter(a => a.fullname.toLowerCase().includes(filterValue));
  }

  remove(member: string): void {
    const index = this.channelService.showedMembers.indexOf(member);

    if (index >= 0) {
      this.channelService.showedMembers.splice(index, 1);
      this.members.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if ((event.option.value !== this.fs.user.uid) && this.isElementInMembersArray(event) == -1) {

      this.channelService.showedMembers.push({ uid: event.option.value, fullname: event.option.viewValue });
      this.memberInput.nativeElement.value = '';
      this.memberCtrl.setValue(null);
    }
  }

  isElementInMembersArray(event) {
    return this.channelService.showedMembers.map(e => e.uid).indexOf(event.option.value);
  }

  setOwnUserToMembers() {
    this.membersObj = {
      uid: this.fs.user.uid,
      read: null,
      last_updated: null,
      viewed_messages: null
    }
    this.members.push(this.membersObj);
  }

  onSubmit(form: NgForm) {

    if (this.members.length != 0) {
      this.chat = new DM();
      this.setChatValues(form.value);
      this.chatService.saveDM();
    }
    form.resetForm()
    this.dialogRef.close();
  }

  setChatValues(data: any) {
    this.setOwnUserToMembers();
    this.setMembertUidsArray();
    this.chat.messages = [];
    this.chat.members = this.members;
    this.chatService.chat = this.chat;
  }

  setMembertUidsArray() {
    this.members.forEach(element => {
      this.chat.memberUids.push(element.uid);
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
