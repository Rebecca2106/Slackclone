import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/models/user.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FireauthService {

  newUser: User;
  user: User;
  newUsername: string;
  authUserData: any;
  uid: string;
  loggedIn: boolean = false;
  userSub: any;
  isNewUser = false;
  docID: string;
  interval: any;

  constructor(public auth: AngularFireAuth, public router: Router, private _SnackBar: MatSnackBar, private firestore: AngularFirestore) {
    const auth1 = getAuth();
    onAuthStateChanged(auth1, (user1) => {

      if (!user1) {
        this.router.navigate(['login']);
        this.loggedIn = false;
      } else {
        this.authUserData = user1;
        this.loggedIn = true;
        this.checkUser(this.authUserData.uid, this.authUserData.email);
      }
    });

  }

  checkUser(uid: string, email: string) {
    this.userSub = this.firestore
      .collection('users', ref => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'docID' })
      .subscribe((user: any) => {
       this.checkUserDetails(user, uid, email);
        
      })
  }

  async checkUserDetails(user, uid, email) {

    if (user.length > 0) {
      this.user = new User(user[0]);
      this.docID = user[0].docID;
      this.router.navigate(['']);

    } else {
      await this.addUser(uid, email);
    }

  }

  async addUser(uid: string, email: string) {
    this.newUser = new User();
    this.newUser.uid = uid;
    this.checkForMail(email);
    this.checkForNewUser();

    await this.firestore
      .collection('users')
      .add(this.newUser.toJSON())
      .then(() => {
      });
  }

  checkForMail(email) {
    if (email) {
      this.newUser.email = email;
    }
  }

  checkForNewUser() {
    if (this.isNewUser) {
      this.newUser.fullname = this.newUsername;
      this.newUsername = '';
      this.isNewUser = false;
    }
  }

  openErrorBar(err) {
    this._SnackBar.open(err, '', {
      duration: 3000,
      // here specify the position
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['access-denied']
    });
  }

  openSuccessBar(data) {
    this._SnackBar.open(data, '', {
      duration: 3000,
      // here specify the position
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['success']
    });
  }

  //SignUp
  signUp(email: string, password: string, username: string) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.isNewUser = true;
        this.newUsername = username;
        this.openSuccessBar('User account successfully created.');
      })
      .catch(error => {
        this.openErrorBar(error);
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
        this.updateTimestamp();
      }
    }, 60 * 1000);
  }

  updateTimestamp() {
    let docRef = this.firestore.collection('users').doc(this.docID);

    // Update the timestamp field with the value from the server
    docRef.update({
      lastTimeOnline: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  updateUser() {
    this.firestore
      .collection('users')
      .doc(this.docID)
      .update(this.user.toJSON())
      .then(() => {
      })
  }
}
