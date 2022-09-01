import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { FireauthService } from '../services/fireauth.service';
import { UiChangeService } from '../services/ui-change.service';
import {AppComponent} from '../app.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/models/user.class';
import { FirebaseMainService } from '../services/firebase-main.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User = new User();

  docID: string;

  constructor(public fsMain: FirebaseMainService ,public myapp: AppComponent, public uiService: UiChangeService, public fs: FireauthService, private firestore: AngularFirestore, public dialog: MatDialog ) { }

  ngOnInit(): void {
    
  }

  openProfileDialog() {
    const dialog = this.dialog.open(ProfileDialogComponent);
  }

}
