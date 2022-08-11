import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UiChangeService {
  showSidebar:boolean = true;
  profile:boolean = false;
  thread:boolean = true;

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
    this.thread = !this.thread; 
  }
}
