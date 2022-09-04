import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/models/user.class';
import { FireauthService } from '../services/fireauth.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseMainService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  allmembers: Array<any> = [];

  loadedUsers = [];

  constructor(private firestore: AngularFirestore, public fs: FireauthService) { }



  async getUserFromId(id) {
    return new Promise(async resolve => {
      const usersRef = collection(this.db, "users");
      const q = query(usersRef, where("uid", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        resolve(doc.data());
      });
    })
  }


  async addUserToList(id) {
    let index = this.loadedUsers.findIndex(element => element.uid == id);
    if (index == -1) {
      let user = await this.getUserFromId(id);
      this.loadedUsers.push(user);
    }
  }

  getUserFromList(id) {
    let result = this.allmembers.find(user => user.uid == id);
    if (!result) {
      return id;
    }
    return result;
  }

  getUserNamesFromList(list) {
    let result = [];
    list.forEach(element => {
      if(element != this.fs.user.uid){
        let usr = this.getUserFromList(element);
        if(usr){
          result.push(usr.fullname);
        } 
      }
    });
    let resJoined = result.join(", ");
    return resJoined;
  }

  getUserOnlineStatus(id) {
    if (id.length == 1) {

      let result = this.allmembers.find(user => user.uid == id);
      if (!result) {
        return 0;
      } else {
        if (result.onlineState) {

          if (this.fs.user.lastTimeOnline != null || result.lastTimeOnline != null) {
            try {
              if (result.lastTimeOnline.toMillis() < this.fs.user.lastTimeOnline.toMillis() - 60000) {
                return 0;
              } else {
                return 1;
              }
            } catch (err) { }
          }
          else {
            return 0;
          }
        } else {
          return 0;
        }
      }
    }
    return id.length;
  }


  userCorrect(element, id) {
    return element.uid == id;
  }

  getAllUsersOrderedByFullname() {
    this.firestore
      .collection('users', ref => ref.orderBy("fullname"))
      .valueChanges()
      .subscribe((users: any) => {
        this.allmembers = users;
      })
  }

}