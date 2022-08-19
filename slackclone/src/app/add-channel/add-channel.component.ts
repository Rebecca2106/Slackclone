import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FireauthService } from '../services/fireauth.service';
import firebase from 'firebase/compat/app';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss']
})
export class AddChannelComponent implements OnInit {
  channel: Channel;
  createdData = {
    uid: this.fs.uid,
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

  constructor(private firestore: AngularFirestore, public dialogRef: MatDialogRef<AddChannelComponent>, public fs: FireauthService) {

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
    if ((event.option.value !== this.fs.uid) && this.isElementInMembersArray(event)==-1) {

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
      uid: this.fs.uid,
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
