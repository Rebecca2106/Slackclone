import { Component, OnInit, HostListener } from '@angular/core';
import { UiChangeService } from '../services/ui-change.service';
import { FireauthService } from '../services/fireauth.service';
import { FirebaseMainService } from '../services/firebase-main.service';

@Component({
  selector: 'app-chatarea',
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.scss']
})
export class ChatareaComponent implements OnInit {
  leftSidebar = {
    positionAbsolute: false,
    width: 250,
    max: 504,
    min: 200,
  }
  rightSidebar = {
    positionAbsolute: false,
    width: 350,
    max: 504,
    min: 250,
  }
  midContentMinWidth = 400;
  midContentWidth = 400;
  sliderWidth = 5;
  doubleSliderWidth = this.sliderWidth * 2;
  screenWidth = window.innerWidth;
  resizing = true;
  resizingRight = false;
  resizingLeft = false;

  currentXPosition = 0;


  constructor(public fsMain: FirebaseMainService ,public uiService: UiChangeService, public fs: FireauthService) {
  }

  ngOnInit(): void {
    this.evaluateWidth();
    this.updateMidContentWidth();
    this.fsMain.getAllUsersOrderedByFullname();
    this.fs.triggerUpdateLastTimeOnline(); 
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.innerWidth; 
    this.evaluateWidth();
  }

  checkMidContentWidth(){
    return this.screenWidth - this.rightSidebar.width - this.leftSidebar.width <= this.midContentMinWidth ;
  }

  checkSetHandyMode(){
    if(this.screenWidth  < 500){
      this.uiService.handyMode = true;
    }else {
      this.uiService.handyMode = false;
    }
  }

  evaluateWidth(){
    this.checkSetHandyMode();
    if(this.checkMidContentWidth()){

      this.leftSidebar.positionAbsolute = true;
      
      if(this.screenWidth >= this.rightSidebar.min + this.midContentMinWidth){
        if(this.screenWidth - this.rightSidebar.width < this.midContentMinWidth){
          this.rightSidebar.width = this.screenWidth - this.midContentMinWidth;
        }
        this.rightSidebar.positionAbsolute = false;
      } else {
        this.rightSidebar.positionAbsolute = true;
      }
    } else {
      this.leftSidebar.positionAbsolute = false;
    }
    this.updateMidContentWidth();
    if(this.checkScreenWidth()){
      this.rightSidebar.width = this.screenWidth;
      this.leftSidebar.width = this.screenWidth;
    } 
  }

  startResize(event, side) {
    if (this.resizing) {
      if (side == 'left') {
        this.resizingLeft = true;
      } else if (side == 'right') {
        this.resizingRight = true;
      }
      this.currentXPosition = event.clientX;
    }
  }

  stopResize() {
    this.resizingLeft = false;
    this.resizingRight = false;
  }

  onResizing(event) {
    this.checkSetHandyMode();
    let difference = event.clientX - this.currentXPosition;
    let leftDiff = this.leftSidebar.width + difference;
    let rightDiff = this.rightSidebar.width - difference;
    if (this.resizingLeft && leftDiff <= this.leftSidebar.max && leftDiff >= this.leftSidebar.min) {
      if (this.checkMidContentWidth()) {
        this.leftSidebar.positionAbsolute = true;
      }else{
        this.leftSidebar.positionAbsolute = false;
      }
      this.leftSidebar.width = leftDiff;
    }
    if (this.resizingRight && rightDiff <= this.rightSidebar.max && rightDiff >= this.rightSidebar.min ) {
      if(this.leftSidebar.positionAbsolute && this.screenWidth - this.rightSidebar.width <= this.midContentMinWidth){
        this.rightSidebar.positionAbsolute = true;
      }else{
        this.rightSidebar.positionAbsolute = false;
      }
      
      if(!this.checkScreenWidth()){
        this.rightSidebar.width -= difference;
      } else {
        this.rightSidebar.width = this.screenWidth;
      }
    }
    this.currentXPosition = event.clientX;
    this.updateMidContentWidth();
  }

  updateMidContentWidth(){
    let width = this.screenWidth;
    if(!this.rightSidebar.positionAbsolute && !this.checkScreenWidth()){
      width -= (this.rightSidebar.width + this.sliderWidth);
    }
    if(!this.leftSidebar.positionAbsolute && !this.checkScreenWidth()){
      width -= (this.leftSidebar.width + this.sliderWidth);
    }
    this.midContentWidth = width;
  }

  checkScreenWidth(){
    return this.screenWidth < 500;
  }
}
