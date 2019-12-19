import { Component, OnInit, Input } from '@angular/core';
import { faBars, faCalendarDay, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { HeaderService } from '../../services/header.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { NavigatorComponent } from '../navigator/navigator.component';
import {ResponsiveService} from '../../services/responsive.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  editIcon = faFolderOpen;

  calendarIcon = faCalendarDay;
  homeIcon = faBars;

  boardLevel: number = 0;

  selectedItem: string = "N/A";

  dateRange = '01/07/2019 - 01/08/2019';

  constructor(
    private headerService: HeaderService,
    private modalService: NgbModal,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit() {
    this.headerService.item.subscribe(item => {
      this.selectedItem = item;
    });

    this.headerService.boardLevel.subscribe(level => {
      this.boardLevel = level;
    });
  }

  open() {
    const modal = this.modalService.open(NavigatorComponent, { size: 'lg', scrollable: true});
    modal.componentInstance.title = "Locations";
  }

  toggleSideBar() {
    this.headerService.toggleSideBar();
  }

  isMobile() {
    return this.responsiveService.isMobile()
  }
}
