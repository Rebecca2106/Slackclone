import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FireauthService } from '../services/fireauth.service';
import firebase from 'firebase/compat/app';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FirebaseChannelService } from '../services/firebase-channel.service';
import { FirebaseMainService } from '../services/firebase-main.service';
import { limitToFirst } from '@firebase/database';

@Component({
  selector: 'app-channel-edit-dialog',
  templateUrl: './channel-edit-dialog.component.html',
  styleUrls: ['./channel-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelEditDialogComponent implements OnInit, OnDestroy {

  channel: Channel;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  memberCtrl = new FormControl('');
  allmembers: Array<any> = [];
  filteredUsers: Array<any> = [];
  creator = false;


  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { docID: string }, private firestore: AngularFirestore, public dialogRef: MatDialogRef<ChannelEditDialogComponent>, public fs: FireauthService, public channelService: FirebaseChannelService, public fb: FirebaseMainService) {

  }

  ngOnInit(): void {
    this.getChannelData();
  }

  async getChannelData () {
    await this.channelService.getChannelforDocID(this.data.docID);
    if(this.channelService.channelDetails.created['uid'] == this.fs.user.uid) {
      this.creator = true;
    }
  }

  getCreator(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
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

  remove(member: any): void {  

    if(this.creator) {
      if (member.uid !== this.fs.user.uid) {
      
        const index = this.channelService.showedMembers.indexOf(member);
        if (index >= 0) {
          this.channelService.showedMembers.splice(index, 1);
        }
      }
    } else {

      if (member.uid == this.fs.user.uid) {
      
        const index = this.channelService.showedMembers.indexOf(member);
        if (index >= 0) {
          this.channelService.showedMembers.splice(index, 1);
        }
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
      this.updateChannel();
    }
    form.resetForm()
    this.dialogRef.close();
  }

  setChannelValues(data: any) {
    this.channel.title = data.title;
    this.channel.description = data.description;
    this.channel.created = this.channelService.channelDetails.created;
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

  updateChannel() {
    this.firestore
      .collection('channels')
      .doc(this.data.docID)
      .update(this.channel.toJSON())
      .then(() => {
        // console.log('Channel updated.');
      })
      .catch(() => {
        console.log('Error while updating channel.');
      });
  }

  deleteChannel() {
    this.firestore
    .collection('channels')
    .doc(this.data.docID)
    .delete()
    .then(() => {
      // console.log('Channel deleted.');
      this.dialogRef.close();
    })
    .catch(() => {
      console.log('Error while deleting channel.');
      this.dialogRef.close();
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}

