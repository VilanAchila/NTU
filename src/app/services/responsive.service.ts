import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  constructor() { }

  isMobile(){
    return (screen.width <= 640) ||
      (window.matchMedia &&
        window.matchMedia('only screen and (max-width: 640px)').matches
      );
  }

}
