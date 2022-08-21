import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class FirebaseMainService {
    app = initializeApp(environment.firebase);
    db = getFirestore(this.app);
  
    constructor() {}

        async getUserImgPathNickname(id){
            const usersRef = collection(this.db, "users");

            const q = query(usersRef, where("uid", "==", id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => { console.log('AAAAAAAAAAAAAAAAAAA', doc.id, " => ", doc.data()); });

        }
  
}