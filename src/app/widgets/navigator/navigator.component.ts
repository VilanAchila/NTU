import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HeaderService} from 'src/app/services/header.service';
import {HttpService} from 'src/app/services/http.service';
import {ConfigurationService} from 'src/app/services/configuration.service';
import {faChevronCircleDown, faChevronCircleUp} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})

export class NavigatorComponent implements OnInit {

  arrowDown = faChevronCircleDown;
  arrowUp = faChevronCircleUp;
  datasourse: any[] = [];
  callapse: boolean[] = [];

  @Input() building_levels;
  boardLevel: number;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private headerService: HeaderService,
    private httpService: HttpService,
    private configs: ConfigurationService
  ) {
    this.headerService.boardLevel.subscribe(level => {
      this.boardLevel = level;
    });

    if(this.headerService.getBuildingMenu() === null){
      this.getSites();
    } else {
      this.datasourse.push(this.headerService.getBuildingMenu());
    }

  }

  ngOnInit() {
  }

  navigateToUrl(url: string, buildingId: number, buildingName: string) {
    this.router.navigateByUrl(encodeURI(url));
    this.headerService.fireNavigationChanged();
    if (buildingId !==  null) {
      this.headerService.setItem(buildingName);
      this.httpService.setbuildingId(buildingId);
    } else {
      this.headerService.setItem("Nanyang Technological University");
    }

    this.modalService.dismissAll();
  }

  navigateToSite(url: string){
    this.router.navigateByUrl(encodeURI(url));
  }

  getSites() {
    this.httpService.get(this.configs.apiEndPoints.sites, {}).subscribe((res) => {
      res.forEach( (element) => {
        this.getCategories(element.siteID, element.siteName);
      });
    },
    (err) => {});
  }

  getCategories(siteId: number, siteName) {
    this.httpService.get(this.configs.apiEndPoints['site-categories'], { siteId }).subscribe((res) => {
      this.getBuildings(res, siteName, siteId);
    },
    (err) => {});
  }

  getBuildings(categoryRes, siteName: string, siteId: number) {
    const siteNavigation = {
      siteId,
      siteName,
      siteCategories: []
    };
    categoryRes.forEach( (element) => {
      this.httpService.get(
        this.configs.apiEndPoints["site-category-all-buildings"],
      { siteId, categoryId: element.buildingCategoryID}).subscribe((res) => {

        const buildingsCategory = {
          categoryId: element.buildingCategoryID,
          categoryName: element.description,
          buildingList: res
        };

        siteNavigation.siteCategories.push(buildingsCategory);
          res.forEach(element => {
            this.callapse.push(false);
          });
      },
      (err) => {});
    });
    this.headerService.setBuildingMenu(siteNavigation);
    this.datasourse.push(siteNavigation);
  }

  expandCallpse(index) {
    this.callapse[index] = !this.callapse[index];
  }
}
