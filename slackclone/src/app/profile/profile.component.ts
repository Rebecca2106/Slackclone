import { Component, OnInit } from '@angular/core';
import { FireauthService } from '../services/fireauth.service';
import { UiChangeService } from '../services/ui-change.service';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/models/user.class';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User = new User();

  docID: string;

  constructor(public uiService: UiChangeService,public fs: FireauthService, private firestore: AngularFirestore, ) { }

  ngOnInit(): void {
    console.log("halooooooo:" + this.fs.user);

      this.firestore
        .collection('users', ref => ref.where('uid', '==', this.fs.uid))
        .valueChanges({ idField: 'docID' })
        .subscribe((user: any) => {
          this.docID = user[0].docID;          
          this.user = new User(user[0]);
        })
      
  }

}
