import {HttpService} from '../../services/http.service';
import {Component, OnInit, OnDestroy } from '@angular/core';
import {HeaderService} from 'src/app/services/header.service';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import {ConfigurationService} from 'src/app/services/configuration.service';
import {DateServiceService} from 'src/app/services/date-service.service';
import {DatePipe} from '@angular/common';
import {InitialService} from 'src/app/services/initial.service';
import {EquipmentBreakdownDataService} from '../../services/equipment-breakdown-data.service';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {ServiceType} from '../../../enums/ServiceType';
import {Interval} from '../../../enums/intervals';
import {GroupBy} from '../../../enums/group-by';
import {DataMode} from '../../../enums/DataMode';

@Component({
  selector: 'app-site-electrical-dashboard',
  templateUrl: './site-electrical-dashboard.component.html',
  styleUrls: ['./site-electrical-dashboard.component.scss']
})
export class SiteElectricalDashboardComponent implements OnInit, OnDestroy  {
  // 0 = overview, 1 = equipment breakdown, 3 = reports
  tabIndex = 0;

  private subscriptions: Subscription[] = [];

  // 0 = week, 1 = month, 2 = year, 3 = 5 years
  trendLogTabIndex = 0;

  dailyConsumptionData: any = {};

  trendLogData: any = {};

  equipDistribution: object;

  equipBreakdown: any = [];

  overollConsumptionData: any;

  today: Date;

  overollConsumptionRange: DateRange;

  equipmentDistRange: DateRange;

  serviceTypeId: number;

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
    private dateService: DateServiceService,
    private initialService: InitialService,
    private datePipe: DatePipe,
    private equipmentBreakDownDatService: EquipmentBreakdownDataService,
    private http: HttpClient
  ) {

    if (this.initialService.getDemoConfig().isDemo) {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    } else {
      this.today = new Date();
    }


    this.todayDateRange = this.dateService.getToday(this.today);

    this.thisWeekDateRange = this.dateService.getThisWeek(this.today);

    this.thisMonthRange = this.dateService.getThisMonth(this.today);

    this.thisYearRange = this.dateService.getThisFullYear(this.today);

    this.lastFiveYearRange = this.dateService.getLastFiveYear(this.today);

    this.equipmentDistRange = this.thisMonthRange;

    this.dataService.serviceTypeId.subscribe(data => {
      this.serviceTypeId = data;
    });
  }

  ngOnInit() {

    this.dataService.get(this.configs.apiEndPoints.site, { siteId: 1 }).subscribe(data => {
      this.headerService.setItem(data.siteName);
    });

    this.overollConsumptionRange = DateRange.lastMonth();

    this.headerService.setBoardLevel(0);
    this.dataService.setserviceTypeId(1);

    this.getOveralConsumptionData();
    this.getTrendDaylyData();
    this.getEqDistribution();
    this.getTrendLogs(1,
      this.datePipe.transform(
        this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd')),
      this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
      'Days of week',
      'Ensergy Consumption(kWh)',
      "Day: $label{br}Consumption: $dataValue");

  }

  setTabIndex(index: number) {
    this.unsubscribeCalls();
    this.tabIndex = index;
    if (this.tabIndex == 1) {
      this.subscriptions = [];
      this.equipBreakdown = [];
      this.equipmertLoading = true;
      this.loaderArray = [];
      this.getEquipmentBreakDown();
    }
  }

  getEqDistribution() {
    this.dataService.get(
      this.configs.apiEndPoints["site-consumption-data-mode"],
      {
        startDate: this.datePipe.transform(this.equipmentDistRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.equipmentDistRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.BuildingCategory,
        serviceType: ServiceType.ELECTRICAL,
        interval: Interval.ThirtyMin,
        siteId: 1,
        dataMode: DataMode.OverallSum
      }).subscribe(data => {
        let processedData = [];
        data.forEach(element => {
          processedData.push(
            {
              label: element.name,
              value: element.data[0].value
            }
          );
        });
        let chart = { ...this.configs.chartConfigurations["eq-distribution"] };
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
          'Ensergy Consumption(kWh)',
          "Day: $label{br}Consumption: $dataValue");
        break;
      };

      case 1: {
        this.trendLogTabIndex = 1;
        this.getTrendLogs(2,
          this.datePipe.transform(this.thisMonthRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.thisMonthRange.end, 'yyyy/MM/dd'),
          'Dates of ' + this.thisMonthRange.start.toLocaleString('default', {month: 'long'}),
          'Electricity Consumption(KWh)',
          "Date: $label{br}Consumption: $dataValue");
        break;
      };

      case 2: {
        this.trendLogTabIndex = 2;
        this.getTrendLogs(3,
          this.datePipe.transform(this.thisYearRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.thisYearRange.end, 'yyyy/MM/dd'),
          'Months of ' + this.datePipe.transform(this.thisYearRange.start, 'yyyy'),
          'Ensergy Consumption(kWh)',
          "Month: $label{br}Consumption: $dataValue");
        break;
      };

      case 3: {
        this.trendLogTabIndex = 3;
        this.getTrendLogsForYear(4,
          this.datePipe.transform(this.lastFiveYearRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.lastFiveYearRange.end, 'yyyy/MM/dd'),
          'Last 5 years',
          'Ensergy Consumption(kWh)',
          "Year: $label{br}Consumption: $dataValue");
        break;
      }
    }
  }

  getOveralConsumptionData() {
    this.dataService.get(this.configs.apiEndPoints['site-consumption-data-mode'],
      {
        siteId: 1,
        startDate: this.overollConsumptionRange.start.toDateString(),
        endDate: this.overollConsumptionRange.end.toDateString(),
        serviceTypeId: this.serviceTypeId,
        dataMode: DataMode.OverallSum,
        groupId: GroupBy.None,
        interval: Interval.ThirtyMin
      }).subscribe(data => {
        this.overollConsumptionData = data[0].data[0].value;
      });
  }

  getTrendDaylyData() {
    this.dataService.get(this.configs.apiEndPoints["trend-log"],
      {
        startDate: this.datePipe.transform(this.todayDateRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.todayDateRange.end, 'yyyy/MM/dd'),
        interval: Interval.ThirtyMin,
        serviceTypeId: ServiceType.ELECTRICAL,
        siteId: 1
      }).subscribe(data => {
        let chart = { ...this.configs.chartConfigurations["elec-trend-log"] };
        chart.xAxisName = 'Time(24 Hour Format)';
        chart.yAxisName = 'Energy Consumption(kWh)';
        chart.plotToolText = "Time: $label{br}Consumption: $dataValue";
        this.dailyConsumptionData = {
          chart,
          data: data[0].data
        };
      });
  }

  getTrendLogs(interval, from, to, xAxis, yAxis, plotToolTip) {
    this.dataService.get(this.configs.apiEndPoints["trend-log"],
      {
        startDate: from,
        endDate: to,
        interval,
        serviceTypeId: ServiceType.ELECTRICAL,
        siteId: 1
      }).subscribe(data => {

        let data0 = [];

          data[0].data.forEach(element => {
            data0.push(
              {
                "label": element.label.substring(0,3),
                "value": element.value
              }
            )
          });

        let chart = { ...this.configs.chartConfigurations["elec-trend-log"] };
        chart.xAxisName = xAxis;
        chart.yAxisName = yAxis;
        chart.plotToolText = plotToolTip;
        this.trendLogData = {
          chart,
          data: data0
        };
      });
  }

  getTrendLogsForYear(interval, from, to, xAxis, yAxis, plotToolTip) {
    this.dataService.get(this.configs.apiEndPoints["trend-log"],
      {
        startDate: from,
        endDate: to,
        interval,
        serviceTypeId: ServiceType.ELECTRICAL,
        siteId: 1
      }).subscribe(data => {

        let chart = { ...this.configs.chartConfigurations["elec-trend-log"] };
        chart.xAxisName = xAxis;
        chart.yAxisName = yAxis;
        chart.plotToolText = plotToolTip;
        this.trendLogData = {
          chart,
          data: data[0].data
        };
      });
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
                  serviceTypeId: ServiceType.ELECTRICAL,
                  startDate: this.dateService.getRoundedHalfHour(30).toLocaleString(),
                  endDate: new Date().toLocaleString(),
                  interval: Interval.ThirtyMin,
                  dataMode: 1,
                  groupId: 3
                });
              buildingsRequests.push(response);
            });
            this.loaderArray.push(true);
            this.subscriptions.push( this.equipmentBreakDownDatService.requestMeterData(buildingsRequests).subscribe( response => {
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

  getEquiDistributionData(dateRange: DateRange) {
    this.dataService.get("site-elec-eq-category", {}).subscribe(data => {
      // this.equipDistribution = data[0].data[0].value;
    });
  }

  overallConsumptionChanged() {
    this.getOveralConsumptionData();
  }

  equiDistributionChanged() {
    this.getEqDistribution();
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
