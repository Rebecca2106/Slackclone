import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseMainService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  allmembers: Array<any> = [];

  constructor(private firestore: AngularFirestore) { }

  async getUserFromId(id) {
    return new Promise(async resolve => {
      const usersRef = collection(this.db, "users");
      const q = query(usersRef, where("uid", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // console.log('Result', doc.id, " => ", doc.data());
        resolve(doc.data());
      });
    })
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