import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe, Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DummyDataService} from 'src/app/services/sample/dummy-data.service';
import {HeaderService} from 'src/app/services/header.service';
import {HttpService} from 'src/app/services/http.service';
import {ConfigurationService} from 'src/app/services/configuration.service';
import {DateServiceService} from 'src/app/services/date-service.service';
import {InitialService} from 'src/app/services/initial.service';

let scrolTop = 0;
@Component({
  selector: 'app-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [

      state('in', style({transform: 'scale(1)', opacity: 1})),

      transition(':enter', [
        style({transform: 'scale(0)', opacity: 0}),
        animate(400)
      ]),

      transition(':leave',
        animate(400, style({transform: 'scale(0)', opacity: 0})))
    ])
  ]
})

export class ImageMapComponent implements OnInit {

  @ViewChild('myDetailDiv', null) detailCard: ElementRef;
  @ViewChild('myZoneDev', null) zoneCard: ElementRef;
  datasourse: any;
  type: string;
  building: string;
  scrolTop = 0;
  cardDetails: number;
  today: Date;
  title: string;
  unit: string;
  buildingName: string;
  imageWidth: number;
  imageHeight: number;
  constructor(
    private route: ActivatedRoute,
    private dataServiceConfig: DummyDataService,
    private router: Router,
    private location: Location,
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: ConfigurationService,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private datePipe: DatePipe
  ) {
    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.type = params.type;
      this.building = params.building;
      this.datasourse = null;
      this.getBuildingMap();
    });
    this.headerService.setItem('Site Map');


    window.addEventListener('scroll', function(event) {
      scrolTop = this.scrollY;
    }, false);

  }

  getBuildingMap() {
    switch (this.type) {
      case 'electricity':
        this.title = 'NTU Map Electricity';
        this.unit = 'kwh';
        break;
      case 'water':
        this.title = 'NTU Map Water';
        this.unit = 'm3/m2';
        break;
    }
    this.dataServiceConfig.getJson('image-map' + '/' + this.building).subscribe( res => {
      this.datasourse = res;
    },
    error => {
      this.router.navigate(['']);
    });
  }

  backBtnClick() {
    this.location.back();
  }

  mouseEnter(event: any) {
    event.target.style.fill = 'rgba(255,255,255, 0.4)';
    event.target.style.stroke = 'red';
    if (this.building !== 'main-map') {
      if(event.target.getAttribute('alt') !== 'null'){
        this.cardDetails = null;
        this.buildingName = event.target.getAttribute('alt');
        this.detailCard.nativeElement.style.display = 'block';
        this.detailCard.nativeElement.style.top = (event.pageY - 120) - scrolTop + 'px';
        this.detailCard.nativeElement.style.left = event.pageX - 100 + 'px';

        const building = event.target.getAttribute('id');
        this.getCardDetails(building);
      }
    } else {
      this.cardDetails = null;
      this.buildingName = event.target.getAttribute('alt');
      this.zoneCard.nativeElement.style.display = 'block';
      this.zoneCard.nativeElement.style.top = (event.pageY - 80) - scrolTop + 'px';
      this.zoneCard.nativeElement.style.left = event.pageX - 100 + 'px';
    }
  }

  onClicked(event: any) {
    event.preventDefault();
    if (event.target.getAttribute('href') !== '#') {
      const url = ['/map/' + this.type + '/' + event.target.getAttribute('href')];
      this.router.navigate(url);
      this.detailCard.nativeElement.style.display = 'none';
      this.zoneCard.nativeElement.style.display = 'none';
    }
  }

  mouseOut(event: any) {
    event.target.style.fill = 'transparent';
    event.target.style.stroke = 'transparent';
    this.cardHide();
  }

  cardHide(){
    this.zoneCard.nativeElement.style.display = 'none';
    this.detailCard.nativeElement.style.display = 'none'
  }

  getPoints(p) {
    return p.toString();
  }

  getCardDetails(building) {
    this.dataService.get(this.configs.apiEndPoints['building-type-consumption'],
      {
        startDate: this.datePipe.transform(this.dateService.getThisMonth(this.today).start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.dateService.getThisMonth(this.today).end, 'yyyy/MM/dd'),
        serviceTypeId: this.type === 'electricity' ? 1 : 2,
        dataMode: 1,
        interval: 0,
        buildingId: building
      }).subscribe(data => {
      this.cardDetails = data[0].data[0].value;
    });
  }

  imageDimension(event){
    this.imageHeight = event.currentTarget.offsetHeight;
    this.imageWidth = event.currentTarget.offsetWidth;
  }

  onPnaImage(event){
    this.cardHide();
  }

}
