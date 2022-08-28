import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UiChangeService } from './services/ui-change.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'slackclone';
  theme = 'dark-theme-green'
  selectedTheme;
  favoriteColor= '';
  colors: string[] = ['pink', 'green'];




  constructor(public overlayContainer: OverlayContainer, public uiService: UiChangeService,) {}

  radioChangeHandler(event: any) {
    console.log(" Value is : ", event.value + '-theme');
    this.selectedTheme = event.value;
    this.onSetTheme(this.selectedTheme + '-theme')
  }

  radioChangeColor(event: any){
    console.log(" Value is : ", event.value);
    this.favoriteColor=event.value;
    this.onSetTheme(this.selectedTheme + '-theme')

  }

  @HostBinding('class') componentCssClass;

  

  onSetTheme(theme) {
    console.log("ich funze",theme);
    this.overlayContainer.getContainerElement().classList.remove(this.theme);
    console.log(this.theme)
    this.overlayContainer.getContainerElement().classList.add(theme+this.favoriteColor);
    this.componentCssClass = theme+this.favoriteColor;
    this.theme=theme+this.favoriteColor;

    console.log(theme+this.favoriteColor)
      
  }

  testingFunction(test){
    console.log("ich funze",test);
  }
}