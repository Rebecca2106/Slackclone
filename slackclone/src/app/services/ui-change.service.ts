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

  bg_lighter_color = "#3e3e42";
  bg_light_color = "#2d2d30";
  bg_dark_color = "#252526 ";
  bg_darker_color = "#1e1e1e";
  font_lowlight_color = "#c4c4cc";
}
