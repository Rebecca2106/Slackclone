import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiChangeService {
  showSidebar:boolean = true;

  constructor() { }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
}
