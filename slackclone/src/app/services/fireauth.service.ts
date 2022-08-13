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
  user: User;
  userData: any;
  uid: string;
  loggedIn: boolean = false;
  userSub: any;
  isGuest = false;

  constructor(public auth: AngularFireAuth, public router: Router, private _errorBar: MatSnackBar, private firestore: AngularFirestore) {
    
    // Setting logged in user
    this.auth.authState.subscribe((user) => {
      this.userData = user;

      if (!user) {
        this.router.navigate(['login']);
        this.loggedIn = false;
        console.log('User logged in:', this.loggedIn);
        
      } else {
        this.loggedIn = true;
        console.log('User logged in:', this.loggedIn);
        this.uid = this.userData.uid;
        this.checkUser(this.uid, this.userData.email);
        this.router.navigate(['']);
      }
    });
  }

  checkUser(uid: string, email: string) {
    this.userSub = this.firestore
      .collection('users', ref => ref.where('uid', '==', uid))
      .valueChanges()
      .subscribe(async (user: any) => {
        if (user.length > 0) {
          this.user = user;   
          console.log('Current user:', this.user);
        } else {
          console.log('User not found!');
          await this.addUser(uid, email);
        }
      })
  }

  async addUser(uid: string, email: string) {
    let newUser = new User();
    newUser.uid = uid;
    if (email) {
      newUser.email = email;
    }
    if(this.isGuest){
      newUser.fullname = 'Guest';
      this.isGuest = false;
    }
    await this.firestore
      .collection('users')
      .add(newUser.toJSON())
      .then(() => {
        console.log('Added new user with UID:', uid);
      });
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
        this.userData = resp.user;
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
        this.userData = resp.user;
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
        this.userData = resp.user;
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
    this.router.navigate(['login']);
  }
}
