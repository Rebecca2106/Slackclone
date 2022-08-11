import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FireauthService {
  userData: any;
  test = "test";
  constructor(public auth: AngularFireAuth, public router: Router,  private _errorBar: MatSnackBar) {

    // Setting logged in user
    this.auth.authState.subscribe((user) => {
      this.userData = user;
      console.log('User', this.userData);
      
      if (!user) {
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['']);
      }
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
      await resp.user.updateProfile({
        displayName: 'Guest' //update name to Guest
      });
      if (resp.user) {
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
    this.auth.signOut();
    this.router.navigate(['login']);
  }
}
