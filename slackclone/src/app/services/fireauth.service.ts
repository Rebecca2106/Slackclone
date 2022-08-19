import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/models/user.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
  isGuest = false;
  isNewUser = false;
  docID: string;
  interval: any;
  interval2: any;

  constructor(public auth: AngularFireAuth, public router: Router, private _SnackBar: MatSnackBar, private firestore: AngularFirestore) {

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
    this.checkForNewUser();

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
  signUp(email:string, password: string, username: string) {
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
    this.setInitalTimeUpdate();

    this.interval = setInterval(() => {
      if (this.user) {
        this.updateTimestamp();
      }
    }, 60 * 1000);
  }

  setInitalTimeUpdate() {
    this.interval2 = setInterval(() => {

      if (!this.user) {
        clearInterval(this.interval2);
        this.setInitalTimeUpdate();
      }

      if (this.user) {
        this.updateTimestamp();
        clearInterval(this.interval2);
      }
    }, 1000);
  }

  updateTimestamp() {
    let docRef = this.firestore.collection('users').doc('this.docID');

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
        // console.log('updated');
      })
  }
}
