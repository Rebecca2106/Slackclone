import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/models/user.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from 'src/models/channel.class';


@Injectable({
  providedIn: 'root'
})
export class FireauthService {
  channel= new Channel;
  newUser: User;
  user: User;
  authUserData: any;
  uid: string;
  loggedIn: boolean = false;
  userSub: any;
  isGuest = false;
  docID: string;
  interval: any;

  constructor(public auth: AngularFireAuth, public router: Router, private _errorBar: MatSnackBar, private firestore: AngularFirestore) {

    // Setting logged in user
    this.auth.authState.subscribe((user) => {
      this.authUserData = user;

      if (!user) {
        this.router.navigate(['login']);
        this.loggedIn = false;
        console.log('User logged in:', this.loggedIn);

      } else {
        this.loggedIn = true;
        console.log('User logged in:', this.loggedIn);
        this.uid = this.authUserData.uid;
        this.checkUser(this.uid, this.authUserData.email);
      }
    });
  }

  checkUser(uid: string, email: string) {
    this.userSub = this.firestore
      .collection('users', ref => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'docID' })
      .subscribe(async (user: any) => {
        if (user.length > 0) {
          this.user = new User(user[0]);
          this.docID = user[0].docID;
          console.log('Current user:', this.user);
          this.router.navigate(['']);
        } else {
          // console.log('User not found!');
          await this.addUser(uid, email);
        }
      })
  }

  async addUser(uid: string, email: string) {

    this.newUser = new User();
    this.newUser.uid = uid;
    this.checkForMail(email);
    this.checkForGuest();

    await this.firestore
      .collection('users')
      .add(this.newUser.toJSON())
      .then(() => {
        // console.log('Added new user with UID:', uid);
      });
  }

  checkForMail(email) {
    if (email) {
      this.newUser.email = email;
    }
  }

  checkForGuest() {
    if (this.isGuest) {
      this.newUser.fullname = 'Guest';
      this.isGuest = false;
    }
  }

  openErrorBar(err) {
    this._errorBar.open(err, '', {
      duration: 3000,
      // here specify the position
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['access-denied']
    });
  }

  // GoogleSignIn
  async loginGoogle() {
    try {
      let resp = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      if (resp.user) {
        this.authUserData = resp.user;
        this.router.navigate(['']);
      }
    }
    catch (error) {
      this.openErrorBar(error);
    }
  }

  // Sign in with mail and password
  async loginMail(email, password) {
    try {
      let resp = await this.auth.signInWithEmailAndPassword(email, password);
      if (resp.user) {
        this.authUserData = resp.user;
        this.router.navigate(['']);
      }
    }
    catch (error) {
      this.openErrorBar(error);
    }
  }

  // Sign in as Guest
  async loginGuest() {
    try {
      let resp = await this.auth.signInAnonymously();
      if (resp.user) {
        this.isGuest = true;
        this.authUserData = resp.user;
        this.router.navigate(['']);
      }
    }
    catch (error) {
      this.openErrorBar(error);
    }
  }

  //Logout
  logout() {
    this.userSub.unsubscribe();
    this.auth.signOut();
    clearInterval(this.interval);
    this.router.navigate(['login']);
  }

  triggerUpdateLastTimeOnline() {
    this.interval = setInterval(() => {
      if (this.user) {
        this.user.lastTimeOnline = new Date().getTime();
        console.log('lastTimeOnline', this.user.lastTimeOnline);
        this.updateUser();
      }
    }, 60*1000);
  }

  updateUser() {    
    this.firestore
      .collection('users')
      .doc(this.docID)
      .update(this.user.toJSON())
      .then(() => {
        // console.log('updated');
      })
  }

}
