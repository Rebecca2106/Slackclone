import { Component, Input, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { AddChatComponent } from '../add-chat/add-chat.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { FireauthService } from '../services/fireauth.service';
import { FirebaseChatService } from 'src/app/services/firebase-chat.service';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  panelOpenState = true;
  @Input() togglePosition;
  iconVisible1 = false;
  iconVisible2 = false;
  channelCollection: Array<any>;
  dmCollection: Array<any>;
  filteredChannelList: Array<any>;
  sortedChatList: Array<any>;
  constructor(public uiService: UiChangeService,public chatService: FirebaseChatService, public dialog: MatDialog, private firestore: AngularFirestore, public fs: FireauthService) { }

  testClick(){
    
  }

  ngOnInit(): void {
    this.firestore
      .collection('channels', ref => ref.orderBy("title"))
      .valueChanges()
      .subscribe((channels: any) => {
        this.channelCollection = channels;
        console.log('channels', this.channelCollection);
        this.filterChannelByUid();
        console.log();
        
      })

      this.chatService.subscribeChats();
  }

  openChannelDialog(): void {
    const dialogRef = this.dialog.open(AddChannelComponent, {
      width: '350px',
    });

  }

  openChatDialog(): void {
    const dialogRef = this.dialog.open(AddChatComponent, {
      width: '350px',
    });

  }

  mouseEnter(iconPosition) {
    if (iconPosition == "iconVisible1") {
      this.iconVisible1 = true
    }

    else {
      this.iconVisible2 = true
    }
  }

  mouseLeave(iconPosition) {
    if (iconPosition == "iconVisible1") {
      this.iconVisible1 = false;
    }

    else {
      this.iconVisible2 = false;
    }
  }

  filterChannelByUid() {
    this.filteredChannelList = this.channelCollection.filter(d => d.members.some(e => e.uid == this.fs.user.uid));
  }

  getOtherUsersNames(list){
    let filteredlist = []
    list.forEach(element => {
      if(element.uid != this.fs.user.uid){
        filteredlist.push(element.uid);
      }
    });
    return filteredlist;
  }

}
