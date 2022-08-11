import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UiChangeService {
  showSidebar:boolean = true;
  profile:boolean = true;
  thread:boolean = false;

  constructor() { }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar; 
  }

  toggleProfile() {
    if(!this.profile){
      this.thread = false;
    }
    this.profile = !this.profile; 
  }
  
  toggleThread() {
    if(!this.thread){
      this.profile = false;
    }
    this.thread = !this.thread; 
  }
}
