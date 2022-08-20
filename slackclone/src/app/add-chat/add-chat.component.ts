import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DM } from 'src/models/dm.class';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FireauthService } from '../services/fireauth.service';
import firebase from 'firebase/compat/app';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FirebaseChatService } from 'src/app/services/firebase-chat.service';


@Component({
  selector: 'app-add-chat',
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.scss']
})
export class AddChatComponent implements OnInit {
  chat: DM;
  createdData = {
    uid: this.fs.user.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  membersObj = {};
  separatorKeysCodes: number[] = [ENTER, COMMA];
  memberCtrl = new FormControl('');
  showedMembers: Array<any> = [];
  members: Array<any> = [];
  allmembers: Array<any> = [];
  filteredUsers: Array<any> = [];

  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;

  constructor(private firestore: AngularFirestore, public dialogRef: MatDialogRef<AddChatComponent>,public chatService: FirebaseChatService, public fs: FireauthService) {

  }

  ngOnInit(): void {
    this.firestore
      .collection('users', ref => ref.orderBy("fullname"))
      .valueChanges()
      .subscribe((users: any) => {
        this.allmembers = users;
      })
  }

  startSearch(e) {
    let filterValue = '';

    if (e) {
      filterValue = e.toLowerCase();
    }
    this.filteredUsers = this.allmembers.filter(a => a.fullname.toLowerCase().includes(filterValue));
  }

  remove(member: string): void {
    const index = this.showedMembers.indexOf(member);

    if (index >= 0) {
      this.showedMembers.splice(index, 1);
      this.members.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if ((event.option.value !== this.fs.user.uid) && this.isElementInMembersArray(event)==-1) {

      this.membersObj = {
        uid: event.option.value,
        read: null,
        last_updated: null,
        viewed_messages: null
      }

      this.members.push(this.membersObj);
      this.showedMembers.push(this.membersObj = { name: event.option.viewValue });
      this.memberInput.nativeElement.value = '';
      this.memberCtrl.setValue(null);
    }
  }

  isElementInMembersArray(event) {
    return this.members.map(e => e.uid).indexOf(event.option.value);
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

  setMembertUidsArray(){
    this.members.forEach(element => {
      this.chat.memberUids.push(element.uid);
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
