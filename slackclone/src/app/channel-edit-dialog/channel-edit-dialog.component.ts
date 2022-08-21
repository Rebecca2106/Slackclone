import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FireauthService } from '../services/fireauth.service';
import firebase from 'firebase/compat/app';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FirebaseChannelService } from '../services/firebase-channel.service';
import { FirebaseMainService } from '../services/firebase-main.service';

@Component({
  selector: 'app-channel-edit-dialog',
  templateUrl: './channel-edit-dialog.component.html',
  styleUrls: ['./channel-edit-dialog.component.scss']
})
export class ChannelEditDialogComponent implements OnInit, OnDestroy {

  channel: Channel;
  createdData = {
    uid: this.fs.user.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  membersObj = {};
  separatorKeysCodes: number[] = [ENTER, COMMA];
  memberCtrl = new FormControl('');
  
  members: Array<any> = [];
  allmembers: Array<any> = [];
  filteredUsers: Array<any> = [];

  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { docID: string }, private firestore: AngularFirestore, public dialogRef: MatDialogRef<ChannelEditDialogComponent>, public fs: FireauthService, public channelService: FirebaseChannelService, public fb: FirebaseMainService) {

  }

  ngOnInit(): void {
    this.channelService.getChannelforDocID(this.data.docID);
    this.fb.getAllUsersOrderedByFullname();
    console.log(this.channelService.showedMembers);
    
  }

  ngOnDestroy(): void {
    this.channelService.showedMembers = [];
  }

  startSearch(e?) {
    let filterValue = '';

    if (e) {
      filterValue = e.toLowerCase();
    }
    this.filteredUsers = this.allmembers.filter(a => a.fullname.toLowerCase().includes(filterValue));
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

      this.membersObj = {
        uid: event.option.value,
        read: null,
        last_updated: null,
        viewed_messages: null
      }

      this.members.push(this.membersObj);
      this.channelService.showedMembers.push(this.membersObj = { name: event.option.viewValue });
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
    console.log('Channeldata from form : ', form.value);
    if (form.value) {
      this.channel = new Channel();
      this.setChannelValues(form.value);
      this.saveChannel();
    }
    form.resetForm()
    this.dialogRef.close();
  }

  setChannelValues(data: any) {
    this.channel.title = data.title;
    this.channel.description = data.description;
    this.channel.created = this.createdData;
    this.setOwnUserToMembers();
    this.channel.members = this.members;
  }

  saveChannel() {
    this.firestore
      .collection('channels')
      .add(this.channel.toJSON())
      .then(() => {
        console.log('Channel created.');
      })
      .catch(() => {
        console.log('Error while saving channel.');
      });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}

