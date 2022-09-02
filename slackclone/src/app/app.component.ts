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
  theme = 'dark-themepink'
  selectedTheme = 'dark'
  favoriteColor = 'pink';
  colors: string[] = ['pink', 'green', 'lightgreen', 'turquoise', 'orange', 'red'];
  images: string[] = ['/assets/img/pink.png','/assets/img/grün.png','/assets/img/lightgreen.png', '/assets/img/blau.png', '/assets/img/gelb.png', '/assets/img/red.png']




  constructor(public overlayContainer: OverlayContainer, public uiService: UiChangeService,) { }


  ngOnInit(): void {
    let themeAsText = localStorage.getItem('theme');
    let colorAsText = localStorage.getItem('color');

    if (colorAsText) {
      this.favoriteColor = JSON.parse(colorAsText)
    }

    if (themeAsText){
      this.selectedTheme= JSON.parse(themeAsText)
    }
    this.uiService.mode=this.selectedTheme;

    this.onSetTheme()
  }



  radioChangeHandler(event: any) {
      this.selectedTheme = event.value;
      this.onSetTheme();
      this.saveTheme();
      this.uiService.mode=this.selectedTheme;
    }

    radioChangeColor(event: any) {
      this.favoriteColor = event.value;
      this.onSetTheme()
      this.saveColor();

    }

    @HostBinding('class') componentCssClass;



    onSetTheme() {
      this.overlayContainer.getContainerElement().classList.remove(this.theme);
      this.overlayContainer.getContainerElement().classList.add(this.selectedTheme +'-theme'+ this.favoriteColor);
      this.componentCssClass = this.selectedTheme +'-theme'+ this.favoriteColor;
      this.theme = this.selectedTheme+'-theme'+this.favoriteColor;

    }

    saveTheme() {
      let themeAsText = JSON.stringify(this.selectedTheme);
      localStorage.setItem('theme', themeAsText)
    }

    saveColor() {
      let colorAsText = JSON.stringify(this.favoriteColor);
      localStorage.setItem('color', colorAsText)
    }

  }