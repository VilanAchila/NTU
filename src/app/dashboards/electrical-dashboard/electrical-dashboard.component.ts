import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Table} from 'src/app/models/table';
import {ConfigurationService} from 'src/app/services/configuration.service';
import {DateServiceService} from 'src/app/services/date-service.service';
import {HeaderService} from 'src/app/services/header.service';
import {HttpService} from 'src/app/services/http.service';
import {InitialService} from 'src/app/services/initial.service';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import {Subscription} from 'rxjs';
import {ServiceType} from '../../../enums/ServiceType';
import {Interval} from '../../../enums/intervals';
import {DataMode} from '../../../enums/DataMode';
import {GroupBy} from '../../../enums/group-by';

@Component({
  selector: 'app-electrical-dashboard',
  templateUrl: './electrical-dashboard.component.html',
  styleUrls: ['./electrical-dashboard.component.scss']
})
export class ElectricalDashboardComponent implements OnInit {
  // 0 = overview, 1 = equipment distribution, 2 = equipment breakdown, 3 = meter tree, 4 = reports
  tabIndex = 0;
  // 0 = week, 1 = month, 2 = year, 3 = 5 years
  trendLogTabIndex = 0;
  dailyConsumptionData: any = {};
  overallConsumptioTotalData: any ;
  overallConsumptioSquareData: any;
  trendLogData: any = {};
  equipDistribution: object;
  equipDistributionLg: object = null;
  meterTreeData: any ;
  today: Date;
  overallDateRange: DateRange;
  eqDIstDateRange: DateRange;
  buildingId: number;
  weekFirst: any;
  weekLast: any;
  monthFirst: any;
  monthLast: any;
  profileDateRange: DateRange;
  buildingName: string;
  eqdistlg: DateRange;
  squareMeterPointerDescription: string;
  todayDateRange: DateRange;
  thisWeekDateRange: DateRange;
  thisMonthRange: DateRange;
  thisYearRange: DateRange;
  lastFiveYearRange: DateRange;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: ConfigurationService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private dateService: DateServiceService,
    private initialService: InitialService
  ) {

    this.overallDateRange = DateRange.lastMonth();

    this.profileDateRange = DateRange.lastMonth();

    this.eqDIstDateRange = DateRange.lastMonth();

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

    this.eqdistlg = DateRange.lastMonth();

    this.eqDIstDateRange = this.thisMonthRange;

    this.weekFirst = new Date().getDate() - new Date().getDay()+1;
    this.weekLast = this.weekFirst + 7;

    this.monthFirst = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.monthLast = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);

    this.route.params.subscribe(params => {
      this.trendLogTabIndex = 0;
      this.tabIndex = 0;
      this.buildingId = params.id;
      this.equipDistributionLg = null;
      this.getBuildingName();
      this.getChartDatas();
    });
  }

  ngOnInit() {}

  private getBuildingName(){
    this.dataService.get(this.configs.apiEndPoints["buildings"], {
      buildingId: this.buildingId
    })
      .subscribe(response => {
        this.buildingName = response.buildingName;
        this.headerService.setItem(this.buildingName);
      });
  }

  private getChartDatas() {
    this.getEqDistribution();
    this.getTrendDaylyData();
    this.getOverallConsumption();
    this.getTrendLogs(1,
      this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd'),
      this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
      'Days of week',
      'Energy Consumption(kWh)',
      "Day: $label{br}Consumption: $dataValue",
      );
  }

  private getMeterTreeData() {
    this.dataService.get(
      this.configs.apiEndPoints['building-type-consumption-group'],
      {
        buildingId: this.buildingId,
        serviceTypeId: ServiceType.ELECTRICAL,
        startDate: this.dateService.getRoundedHalfHour(30).toLocaleString(),
        endDate: new Date().toLocaleString(),
        interval: Interval.ThirtyMin,
        dataMode: DataMode.OverallSum,
        groupId: GroupBy.Meter
      }).subscribe(data => {
      this.meterTreeData = data;
    });
  }

  getTrendDaylyData () {
    this.dataService.get(this.configs.apiEndPoints["trend-log-data-building"],
    {
      startDate: this.datePipe.transform(this.todayDateRange.start, 'yyyy/MM/dd'),
      endDate: this.datePipe.transform(this.todayDateRange.end, 'yyyy/MM/dd'),
      interval: Interval.ThirtyMin,
      serviceTypeId: ServiceType.ELECTRICAL,
      buildingId:  this.buildingId
    }).subscribe( data => {
      let chart = {...this.configs.chartConfigurations["elec-trend-log"]};
      chart.xAxisName = "Time(24 Hour Format)";
      chart.yAxisName = "Energy Consumption (kWh)";
      this.dailyConsumptionData = {
        chart,
        data: data[0].data
      };
    });
  }

  getTrendLogs (interval, from, to, xAxis, yAxis, plotToolTip) {
    this.dataService.get(this.configs.apiEndPoints["trend-log-data-building"],
    {
      startDate: from,
      endDate: to,
      interval,
      serviceTypeId: ServiceType.ELECTRICAL,
      buildingId: this.buildingId
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

  getEqDistribution(){
    this.dataService.get(
      this.configs.apiEndPoints["eq-distribution-building"],
      {
        startDate: this.datePipe.transform(this.eqDIstDateRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.eqDIstDateRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.MeterType,
        serviceTypeId: ServiceType.ELECTRICAL,
        buildingId:  this.buildingId,
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

  getEqDistributionLg (){
    this.dataService.get(
      this.configs.apiEndPoints["eq-distribution-building"],
      {
        startDate: this.datePipe.transform(this.eqdistlg.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.eqdistlg.end, 'yyyy/MM/dd'),
        groupId: GroupBy.MeterType,
        buildingId:  this.buildingId,
        serviceTypeId: ServiceType.ELECTRICAL,
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
        let chart = {...this.configs.chartConfigurations["eq-distribution-lg"]};
        this.equipDistributionLg = {
          chart: chart,
          data: processedData
        };
    });
  }

  setTabIndex(index: number) {
    this.tabIndex = index;

    if(this.tabIndex == 0) {
      this.getChartDatas();
    }else if(this.tabIndex == 1) {
      this.equipDistributionLg = {};
      this.getEqDistributionLg();
    }else if(this.tabIndex == 2) {
      // this.setEquipBreadkdownData();
      this.getMeterTreeData();
    }else if(this.tabIndex ==3){
      this.meterTreeData = null;
      this.getMeterTreeData ();
    }
  }

  setTrendLogData(index: number) {
    switch(index) {
      case 0: {
        this.trendLogTabIndex = 0;
        this.getTrendLogs(1,
          this.datePipe.transform(
            this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd')),
          this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
            'Days of week',
            'Energy Consumption(kWh)',
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
          'Months of '+this.datePipe.transform(this.thisYearRange.start, 'yyyy'),
          'Energy Consumption(kWh)',
          "Month: $label{br}Consumption: $dataValue");
        break;
      };

      case 3: {
        this.trendLogTabIndex = 3;
        this.getTrendLogs(4,
          this.datePipe.transform(this.lastFiveYearRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.lastFiveYearRange.end, 'yyyy/MM/dd'),
          'Last five years',
          'Energy Consumption(kWh)',
          "Year: $label{br}Consumption: $dataValue");
        break;
      }
    }
  }

  getOverallConsumption() {
    this.dataService.get(
      this.configs.apiEndPoints['building-type-consumption'],
      {
        startDate: this.overallDateRange.start.toDateString(),
        endDate: this.overallDateRange.end.toDateString(),
        serviceTypeId: ServiceType.ELECTRICAL,
        dataMode: DataMode.OverallSum,
        interval: Interval.ThirtyMin,
        buildingId: this.buildingId
      }).subscribe(data => {
        this.overallConsumptioTotalData = data[0].data[0].value;
        this.getGfa();
    },
     error => {
      this.overallConsumptioTotalData = null;
    });
  }

  getGfa() {
    this.dataService.get(
      this.configs.apiEndPoints["building-gfa"],
      { buildingID: this.buildingId }).subscribe( data => {
        if(data == null){
          this.overallConsumptioSquareData = null;
          this.squareMeterPointerDescription = 'Total consumption / m<sup>2</sup><br> (GFA = N/A m<sup>2</sup>)';
          return;
        }
        if (data.floorArea !== 0 && this.overallConsumptioTotalData !== null) {
          this.overallConsumptioSquareData = this.overallConsumptioTotalData/(data.floorArea);
          this.squareMeterPointerDescription = 'Total consumption per square meter2 (GFA = '+data.floorArea+' m<sup>2</sup>)';
        } else {
          this.overallConsumptioSquareData = null;
          this.squareMeterPointerDescription = 'Total consumption per square meter (GFA = N/A m<sup>2</sup>)';
        }
    }, error => {
      this.overallConsumptioSquareData = null;
      this.squareMeterPointerDescription = 'kWh/m2 (GFA = N/A m<sup>2</sup>sup>)';
    });
  }

  dateRangeListner(chartType) {
    let dataset;
    switch (chartType) {
      case 'eqDist':
        dataset = this.getEqDistribution();
        if (dataset !== null) {

        } else {

        }
        break;
      case 'overall':
        dataset = this.getOverallConsumption();
        break;
      case 'eqdistlg':
        this.getEqDistributionLg();
        break;

    }
  }
}
