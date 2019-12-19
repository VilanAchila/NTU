import {Component, Input, OnInit} from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import {  faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ConfigurationService } from 'src/app/services/configuration.service';
import {HeaderService} from '../../services/header.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NavigatorComponent} from '../navigator/navigator.component';
import {VersionComponent} from '../version/version.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})

export class SideBarComponent implements OnInit {

  menuItems: any = [];
  backArrow = faArrowLeft;
  isSideMenuActive: boolean;

  constructor(private dataService: HttpService, private endPoints: ConfigurationService, private headerService: HeaderService, private modalService: NgbModal) {
    this.headerService.isSideBarActive.subscribe(isActive => {
      this.isSideMenuActive = isActive;
    });
  }

  ngOnInit() {
    this.dataService.get(this.endPoints.apiEndPoints["side-menu"], {}).subscribe(items => {
      this.menuItems = items;
    });
  }

  toggleSideBar() {
    this.headerService.toggleSideBar();
  }

  openVersionModel() {
    const modal = this.modalService.open(VersionComponent, { size: 'lg', scrollable: true});
    modal.componentInstance.title = "Locations";
  }
}
