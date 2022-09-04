import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FireauthService } from '../services/fireauth.service';
import firebase from 'firebase/compat/app';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FirebaseMainService } from '../services/firebase-main.service';
import { FirebaseChannelService } from '../services/firebase-channel.service';


@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss']
})
export class AddChannelComponent implements OnInit, OnDestroy {
  channel: Channel;
  createdData = {
    uid: this.fs.user.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  membersObj = {};
  separatorKeysCodes: number[] = [ENTER, COMMA];
  memberCtrl = new FormControl('');
  filteredUsers: Array<any> = [];

  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;

  constructor(private firestore: AngularFirestore, public dialogRef: MatDialogRef<AddChannelComponent>, public fs: FireauthService, public fb: FirebaseMainService, public channelService: FirebaseChannelService) {

  }

  ngOnInit(): void {
    this.setOwnUserToMembers();
  }

  ngOnDestroy(): void {
    this.channelService.showedMembers = [];
  }

  setOwnUserToMembers() {
    this.channelService.showedMembers.push({ uid: this.fs.user.uid, fullname: this.fs.user.fullname, email: this.fs.user.email });
  }

  startSearch(e?) {
    let filterValue = '';

    if (e) {
      filterValue = e.toLowerCase();
    }
    this.filteredUsers = this.fb.allmembers.filter(a => a.fullname.toLowerCase().includes(filterValue));    
  }

  remove(member: any): void {    
    if (member.uid !== this.fs.user.uid) {
      
      const index = this.channelService.showedMembers.indexOf(member);
      if (index >= 0) {
        this.channelService.showedMembers.splice(index, 1);
      }
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

  onSubmit(form: NgForm) {
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
    this.setMemberValues();
  }

  setMemberValues () {
    this.channel.members = this.channelService.showedMembers.map( e => {
      return  {
        uid: e.uid,
        read: null,
        last_updated: null,
        viewed_messages: null
      }
    })   
  }

  saveChannel() {
    this.firestore
      .collection('channels')
      .add(this.channel.toJSON())
      .then(() => {
        // console.log('Channel created.');
      })
      .catch(() => {
        console.log('Error while saving channel.');
      });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
