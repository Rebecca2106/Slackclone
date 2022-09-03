import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DSAKeyPairKeyObjectOptions } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class UiChangeService {
  showSidebar: boolean = true;
  profile: boolean = false;
  thread: boolean = false;
  handyMode: boolean = false;
  showDesign: boolean = false;
  image: string;
  showImg: boolean = false;
  mode:string= 'dark';
  editorLoaded: boolean = false;

  constructor(private firestore: AngularFirestore) {
    document.addEventListener('mouseup', () => {
      if (this.showImg) {
        this.showImg = false;
      };
    })
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  toggleDesign() {
    this.showDesign = !this.showDesign;

  }

  toggleProfile() {
    if (!this.profile) {
      this.thread = false;
    }
    this.profile = !this.profile;
  }

  toggleThread() {
    if (!this.thread) {
      this.profile = false;
    }
    this.thread = !this.thread;
  }

  imagePopup(img) {
    this.image = img;
    this.showImg = true;
  }

  closeImg() {
    this.showImg = false;
  }

  openThread() {
    this.profile = false;
    this.thread = true;
  }

  bg_lighter_color = "#3e3e42";
  bg_light_color = "#2d2d30";
  bg_dark_color = "#252526 ";
  bg_darker_color = "#1e1e1e";
  font_lowlight_color = "#c4c4cc";


}