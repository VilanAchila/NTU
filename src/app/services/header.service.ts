import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpService} from './http.service';
import {ConfigurationService} from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  item = new BehaviorSubject('N/A');

  buildingMenuItems: any = null;

  // 0 = site level, 1 = building level
  boardLevel = new BehaviorSubject<number>(0);

  isSideBarActive = new BehaviorSubject<boolean>(false);

  navigationChanged: EventEmitter<number> = new EventEmitter();

  constructor(
    private  dataService: HttpService,
    private configService: ConfigurationService
  ) { }

  setItem(item: string) {
    this.item.next(item);
  }

  setBoardLevel(level: number) {
    this.boardLevel.next(level);
  }

  toggleSideBar() {
    this.isSideBarActive.next(!this.isSideBarActive.value);
  }

  getBuildingMenu(){
    return this.buildingMenuItems;
  }

  setBuildingMenu(menuList){
    this.buildingMenuItems = menuList;
  }


  fireNavigationChanged() {
    this.navigationChanged.emit();
};

}
