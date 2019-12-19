import {HttpService} from './../../services/http.service';
import {Component, OnInit, OnDestroy } from '@angular/core';
import {HeaderService} from 'src/app/services/header.service';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import {ConfigurationService} from 'src/app/services/configuration.service';
import {DatePipe} from '@angular/common';
import {DateServiceService} from 'src/app/services/date-service.service';
import {InitialService} from 'src/app/services/initial.service';
import {EquipmentBreakdownDataService} from '../../services/equipment-breakdown-data.service';
import {Subscription} from 'rxjs';
import {ServiceType} from '../../../enums/ServiceType';
import {Interval} from '../../../enums/intervals';
import {GroupBy} from '../../../enums/group-by';
import {DataMode} from '../../../enums/DataMode';

@Component({
  selector: 'app-site-water-dashboard',
  templateUrl: './site-water-dashboard.component.html',
  styleUrls: ['./site-water-dashboard.component.scss']
})
export class SiteWaterDashboardComponent implements OnInit, OnDestroy  {
  // 0 = overview, 1 = equipment breakdown, 3 = reports
  tabIndex = 0;
  private subscriptions: Subscription[] = [];
  // 0 = week, 1 = month, 2 = year, 3 = 5 years
  trendLogTabIndex = 0;

  dailyConsumptionData: object = {};

  trendLogData: object = {};

  equipDistribution: object;

  equipBreakdown: any = [];

  today: Date;

  overollConsumptionRange: DateRange;

  overollConsumptionData: any;

  serviceTypeId: number;

  equipmentDistRange: DateRange;

  todayDateRange: DateRange;

  thisWeekDateRange: DateRange;

  thisMonthRange: DateRange;

  thisYearRange: DateRange;

  lastFiveYearRange: DateRange;

  loaderArray: any[] =[];

  equipmertLoading: boolean = true;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: ConfigurationService,
    private datePipe: DatePipe,
    private dateService: DateServiceService,
    private initialService: InitialService,
    private equipmentBreakDownDatService: EquipmentBreakdownDataService
  ) {

    if(this.initialService.getDemoConfig().isDemo){
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }

    this.todayDateRange = this.dateService.getToday(this.today);

    this.thisWeekDateRange = this.dateService.getThisWeek(this.today);

    this.thisMonthRange = this.dateService.getThisMonth(this.today);

    this.thisYearRange = this.dateService.getThisFullYear(this.today);

    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);

    this.overollConsumptionRange = DateRange.lastMonth();

    this.equipmentDistRange = DateRange.lastMonth();

    this.dataService.serviceTypeId.subscribe(data => {
      this.serviceTypeId = data;
    });
  }

  ngOnInit() {
    this.dataService.get(this.configs.apiEndPoints.site, { siteId: 1 }).subscribe(data => {
      this.headerService.setItem(data.siteName);
    });

    this.headerService.setBoardLevel(1);
    this.dataService.setserviceTypeId(2);

    this.getOverollConsumptionData();
    this.getTrendDaylyData();
    this.getEqDistribution();
    this.getTrendLogs(1,
      this.datePipe.transform(
        this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd')),
      this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
      'Days of week',
      'Water Consumption(m3)',
      "Day: $label{br}Consumption: $dataValue");
  }

  setTabIndex(index: number) {
    this.unsubscribeCalls();
    this.tabIndex = index;

    if (this.tabIndex == 1) {
      this.equipBreakdown = [];
      this.getEquipmentBreakDown();
    }
  }

  getTrendDaylyData () {
    this.dataService.get(this.configs.apiEndPoints["trend-log"],
    {
      startDate: this.datePipe.transform(this.todayDateRange.start, 'yyyy/MM/dd'),
      endDate: this.datePipe.transform(this.todayDateRange.end, 'yyyy/MM/dd'),
      interval: Interval.ThirtyMin,
      serviceTypeId: ServiceType.WATER,
      siteId: 1
    }).subscribe( data => {
      let chart = {...this.configs.chartConfigurations["elec-trend-log"]};
      chart.plotToolText = 'Consumption of $label - $value m3';
      chart.xAxisName = "Time(24 Hour Format)";
      chart.yAxisName = 'Water Consumption (m3)';
      this.dailyConsumptionData = {
        chart,
        data: data[0].data
      };
    });
  }

  getEqDistribution(){
    this.dataService.get(
      this.configs.apiEndPoints["site-consumption-data-mode"],
      {
        startDate: this.datePipe.transform(this.equipmentDistRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.equipmentDistRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.BuildingCategory,
        serviceType: ServiceType.WATER,
        interval: Interval.ThirtyMin,
        siteId: 1,
        dataMode: DataMode.OverallSum
      }).subscribe( data => {
        let processedData = [];
        data.forEach(element => {
          processedData.push(
            {
              label: element.name,
              value: element.data[0].value
            }
          );
        });
        let chart = {...this.configs.chartConfigurations["eq-distribution"]};
        this.equipDistribution = {
          chart: chart,
          data: processedData
        };
    });
  }

  setTrendLogData(index: number) {
    switch (index) {
      case 0: {
        this.trendLogTabIndex = 0;
        this.getTrendLogs(1,
          this.datePipe.transform(
            this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd')),
            this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
            'Days of week',
          'Water Consumption(m3)',
          "Day: $label{br}Consumption: $dataValue");
        break;
      }

      case 1: {
        this.trendLogTabIndex = 1;
        this.getTrendLogs(2,
          this.datePipe.transform(this.thisMonthRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.thisMonthRange.end, 'yyyy/MM/dd'),
          'Dates of ' + this.thisMonthRange.start.toLocaleString('default', {month: 'long'}),
          'Water Consumption(m3)',
          "Date: $label{br}Consumption: $dataValue");
        break;
      }

      case 2: {
        this.trendLogTabIndex = 2;
        this.getTrendLogs(3,
          this.datePipe.transform(this.thisYearRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.thisYearRange.end, 'yyyy/MM/dd'),
          'Months of ' + this.datePipe.transform(this.thisYearRange.start, 'yyyy'),
          'Water Consumption(m3)',
          "Month: $label{br}Consumption: $dataValue");
        break;
      }

      case 3: {
        this.trendLogTabIndex = 3;
        this.getTrendLogs(4,
          this.datePipe.transform(this.lastFiveYearRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.lastFiveYearRange.end, 'yyyy/MM/dd'),
          'Last 5 years',
          'Water Consumption(m3)',
          "Year: $label{br}Consumption: $dataValue");
        break;
      }
    }
  }

  getEquipmentBreakDown() {
    this.dataService.get(
      this.configs.apiEndPoints["site-categories"], { siteId: 1 }).toPromise().then(data => {
      data.forEach((category, key) => {
        this.dataService.get(
          this.configs.apiEndPoints["site-category-all-buildings"], { categoryId: category.buildingCategoryID, siteId: 1 }
        ).toPromise().then(data => {
          let buildingsRequests =[];
          let buildings = [];
          data.forEach((building, key) => {
            buildings.push(building.buildingName);
            let response =  this.dataService.getRequest(
              this.configs.apiEndPoints['building-type-consumption-group'],
              {
                buildingId: building.buildingID,
                serviceTypeId: ServiceType.WATER,
                startDate: this.dateService.getRoundedHalfHour(30).toLocaleString(),
                endDate: new Date().toLocaleString(),
                interval: Interval.ThirtyMin,
                dataMode: 1,
                groupId: 3
              });
            buildingsRequests.push(response);
          });
          this.loaderArray.push(true);
          this.subscriptions.push(this.equipmentBreakDownDatService.requestMeterData(buildingsRequests).subscribe( response => {
            this.loaderSwitcher();
            response.forEach((response, key) => {
              let item = [];
              item.push(category.description);
              item.push(buildings[key]);
              item.push(response.length);
              let tot = 0;
              response.forEach(item => {
                if (item.data[0].value !== null) {
                  tot += item.data[0].value;
                }
              });
              item.push(tot);
              this.equipBreakdown.push(item);
            });
          } ));
        });
      });
    });
  }

  loaderSwitcher(){
    for(let i=0; i<this.loaderArray.length; i++){
      if(this.loaderArray[i]){
        this.loaderArray[i] = !this.loaderArray[i];
        break;
      }
    }

    let load = true;
    this.loaderArray.forEach((data)=>{
      if(data){
        load = true;
        return;
      } else {
        load = false;
      }
    });

    if(!load){
      this.equipmertLoading = false;
    }
  }

  getTrendLogs (interval, from, to, xAxis, yAxis, plotToolTip) {
    this.dataService.get(this.configs.apiEndPoints["trend-log"],
    {
      startDate: from,
      endDate: to,
      interval,
      serviceTypeId: ServiceType.WATER,
      siteId: 1
    }).subscribe( data => {
      let chart = {...this.configs.chartConfigurations["elec-trend-log"]};
      chart.xAxisName = xAxis;
      chart.yAxisName = yAxis;
      chart.plotToolText = plotToolTip;
      this.trendLogData = {
        chart,
        data: data[0].data
      };
    });
  }

  getOverollConsumptionData () {
    this.dataService.get(this.configs.apiEndPoints['site-consumption-data-mode'],
    {
      siteId: 1,
      startDate: this.overollConsumptionRange.start.toDateString(),
      endDate: this.overollConsumptionRange.end.toDateString(),
      serviceTypeId: ServiceType.WATER,
      dataMode: DataMode.OverallSum,
      groupId: GroupBy.None,
      interval: Interval.ThirtyMin
    }).subscribe(data => {
      this.overollConsumptionData = data[0].data[0].value;
    });
  }

  equiDistributionChanged() {
    this.getEqDistribution();
  }

  overollConsuptionChanged () {
    this.getOverollConsumptionData();
  }

  unsubscribeCalls(){
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnDestroy(){
    this.unsubscribeCalls();
  }

}
