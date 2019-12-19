import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { HeaderService } from './services/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isSideMenuActive: boolean;

  public constructor(private headerService: HeaderService) {
    this.headerService.isSideBarActive.subscribe(isActive => {
      this.isSideMenuActive = isActive;
    });
  }

  overlayClicked(){
    this.isSideMenuActive = false;
  }

  detectmob() {
    if(window.innerWidth <= 800) {
      return true;
    } else {
      return false;
    }
  }

}
