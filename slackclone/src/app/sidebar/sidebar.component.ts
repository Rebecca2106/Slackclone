import { Component, Input, OnInit } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { AddChatComponent } from '../add-chat/add-chat.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireauthService } from '../services/fireauth.service';
import { FirebaseChatService } from 'src/app/services/firebase-chat.service';
import { FirebaseChannelService } from 'src/app/services/firebase-channel.service';
import { ChannelEditDialogComponent } from '../channel-edit-dialog/channel-edit-dialog.component';
import { FirebaseMainService } from '../services/firebase-main.service';
import { FirebaseChannelChatThreadService } from 'src/app/services/firebase-channel-chat-thread.service';


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
  dmCollection: Array<any>;
  filteredChannelList: Array<any>; 
  constructor(public fcctService: FirebaseChannelChatThreadService, public uiService: UiChangeService, public channelService: FirebaseChannelService, public chatService: FirebaseChatService, public dialog: MatDialog, private firestore: AngularFirestore, public fs: FireauthService, public fb: FirebaseMainService) { }


  ngOnInit(): void {
    
    this.channelService.subscribeChannels();
    this.chatService.subscribeChats();
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

  openChannelDialog(): void {
    const dialogRef = this.dialog.open(AddChannelComponent, {
      width: '350px',
    });

  }

  editChannel(id: string):  void {
    this.dialog.open(ChannelEditDialogComponent, {
      width: '350px',
      data: { docID: id },
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

}
