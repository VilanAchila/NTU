import {Component, OnInit} from '@angular/core';
import {HeaderService} from 'src/app/services/header.service';
import {Table} from 'src/app/models/table';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import {HttpService} from 'src/app/services/http.service';
import {ConfigurationService} from 'src/app/services/configuration.service';
import {DateServiceService} from 'src/app/services/date-service.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {InitialService} from 'src/app/services/initial.service';
import {Interval} from '../../../enums/intervals';
import {ServiceType} from '../../../enums/ServiceType';
import {DataMode} from '../../../enums/DataMode';
import {GroupBy} from '../../../enums/group-by';

@Component({
  selector: 'app-water-dashboard',
  templateUrl: './water-dashboard.component.html',
  styleUrls: ['./water-dashboard.component.scss']
})
export class WaterDashboardComponent implements OnInit {

  // 0 = overview, 1 = equipment distribution, 2 = equipment breakdown, 3 = meter tree, 4 = reports
  tabIndex = 0;

  // 0 = week, 1 = month, 2 = year, 3 = 5 years
  trendLogTabIndex = 0;

  dailyConsumptionData: object = {};

  trendLogData: object = {};

  equipDistribution: object;

  meterTreeData: any;

  equipBreakdown: Table;

  today: Date;

  dateRange: DateRange;

  overollConsumptionRange: DateRange;

  overollConsumptionData: any;

  overallConsumptioSquareData: any;

  eqDIstDateRange: DateRange;

  buildingId: number;

  serviceTypeId: number = 2;

  weekFirst: any;
  weekLast: any;

  monthFirst: any;
  monthLast: any;

  buildingName: string;

  todayDateRange: DateRange;

  thisWeekDateRange: DateRange;

  thisMonthRange: DateRange;

  thisYearRange: DateRange;

  lastFiveYearRange: DateRange;

  squareMeterPointerDescription: string;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: ConfigurationService,
    private dateService: DateServiceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private initialService: InitialService
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
    this.dateRange = DateRange.lastMonth();
    this.eqDIstDateRange = DateRange.lastMonth();

    this.weekFirst = new Date().getDate() - new Date().getDay()+1;
    this.weekLast = this.weekFirst + 7;

    this.monthFirst = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.monthLast = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);

    this.overollConsumptionRange = DateRange.lastMonth();

    this.route.params.subscribe(params => {
      this.trendLogTabIndex = 0;
      this.tabIndex = 0;
      this.buildingId = params.id;
      this.getBuildingName();
      this.getChartDetails();
    });
  }

  ngOnInit() {
    this.headerService.setBoardLevel(1);
  }

  private getBuildingName(){
    this.dataService.get(this.configs.apiEndPoints["buildings"], {
      buildingId: this.buildingId
    })
      .subscribe(response => {
        this.buildingName = response.buildingName;
        this.headerService.setItem(this.buildingName);
      });
  }

  private getChartDetails(){
    this.getOverallConsumption();
    this.getTrendDaylyData();
    this.getTrendLogs(1,
      this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd'),
      this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
      'Days of week',
      'Water Consumption (m3)',
      "Day: $label{br}Consumption: $dataValue");
    this.getEqDistribution();
  }


  private getMeterTreeData() {
    this.dataService.get(
      this.configs.apiEndPoints['building-type-consumption-group'],
      {
        buildingId: this.buildingId,
        serviceTypeId: ServiceType.WATER,
        startDate: this.datePipe.transform(this.thisYearRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(new Date(), 'yyyy/MM/dd'),
        interval: Interval.ThirtyMin,
        dataMode: DataMode.OverallSum,
        groupId: GroupBy.Meter
      }).subscribe(data => {
      this.meterTreeData = data;
    });
  }

  private getOverallConsumption() {
    this.dataService.get(this.configs.apiEndPoints['building-type-consumption'],
    {
      siteId: 1,
      startDate: this.overollConsumptionRange.start.toDateString(),
      endDate: this.overollConsumptionRange.end.toDateString(),
      serviceTypeId: ServiceType.WATER,
      buildingId: this.buildingId,
      dataMode: DataMode.OverallSum,
      groupId: GroupBy.None,
      interval: Interval.ThirtyMin
    }).subscribe(data => {
      this.overollConsumptionData = data[0].data[0].value;
      this.getGfa();
    });
  }

  getGfa() {
    this.dataService.get(
      this.configs.apiEndPoints['building-gfa'],
      {
          buildingID: this.buildingId,
          serviceTypeId: this.serviceTypeId,
      }).subscribe(data => {
      if(data == null){
        this.overallConsumptioSquareData = null;
        this.squareMeterPointerDescription = 'Total consumption / m<sup>2</sup><br> (GFA = N/A m2)';
        return;
      }
      if (data.floorArea !== 0 && this.overollConsumptionData !== null) {
        this.overallConsumptioSquareData = this.overollConsumptionData/(data.floorArea);
        this.squareMeterPointerDescription = 'Total consumption per square meter2 (GFA = '+data.floorArea+' m2)';
      } else {
        this.overallConsumptioSquareData = null;
        this.squareMeterPointerDescription = 'Total consumption per square meter (GFA = N/A m2)';
      }
    }, error => {
      this.overallConsumptioSquareData = null;
    });
    this.overallConsumptioSquareData = null;
  }

  getEqDistribution(){
    this.dataService.get(
      this.configs.apiEndPoints["eq-distribution-building"],
      {
        startDate: this.datePipe.transform(this.eqDIstDateRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.eqDIstDateRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.MeterType,
        serviceTypeId: ServiceType.WATER,
        buildingId:  this.buildingId,
        interval: Interval.ThirtyMin,
        siteId: 1,
        dataMode: DataMode.OverallSum
      }).subscribe( data => {
        this.equipDistribution = data[0].data;
    });
  }

  setTabIndex(index: number) {
    this.tabIndex = index;

    if(this.tabIndex == 0) {
      this.getChartDetails();
    }else if(this.tabIndex == 1) {
      this.getMeterTreeData();
    }else if(this.tabIndex == 2){
      this.meterTreeData = null;
      this.getMeterTreeData();
    }
  }

  getTrendDaylyData () {
    this.dataService.get(this.configs.apiEndPoints["trend-log-data-building"],
    {
      startDate: this.datePipe.transform(this.todayDateRange.start, 'yyyy/MM/dd'),
      endDate: this.datePipe.transform(this.todayDateRange.end, 'yyyy/MM/dd'),
      interval: Interval.ThirtyMin,
      serviceTypeId: ServiceType.WATER,
      buildingId:  this.buildingId,
    }).subscribe( data => {
      let chart = {...this.configs.chartConfigurations["elec-trend-log"]};
      chart.xAxisName = "Time(24 Hour Format)";
      chart.yAxisName = 'Water Consumption (m3)';
      chart.plotToolText = 'Consumption of $label - $value m3';
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
      serviceTypeId: ServiceType.WATER,
      buildingId:  this.buildingId,
    }).subscribe( data => {

      let data0 = [];

      data[0].data.forEach(element => {
        data0.push(
          {
            "label": element.label.substring(0,3),
            "value": element.value
          }
        )
      });

      let chart = {...this.configs.chartConfigurations["elec-trend-log"]};
      chart.xAxisName = xAxis;
      chart.yAxisName = yAxis;
      chart.plotToolText = plotToolTip;
      chart.plotToolText = 'Consumption of $label - $value m3';
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

  getEqDistributionLg (){}

  overallConsumptionChanged () {
    this.getOverallConsumption();
  }

  eqDateRangeChange(){
    this.getEqDistribution();
  }

  setTrendLogData(index: number) {
    switch(index) {
      case 0: {
        this.trendLogTabIndex = 0;
        this.getTrendLogs(
          Interval.Daily,
          this.datePipe.transform(
            this.datePipe.transform(this.thisWeekDateRange.start, 'yyyy/MM/dd')),
          this.datePipe.transform(this.thisWeekDateRange.end, 'yyyy/MM/dd'),
          'Days of week',
          'Water Consumption (m3)',
          "Day: $label{br}Consumption: $dataValue");
        break;
      };

      case 1: {
        this.trendLogTabIndex = 1;
        this.getTrendLogs(2,
          this.datePipe.transform(this.thisMonthRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.thisMonthRange.end, 'yyyy/MM/dd'),
          'Dates of ' + this.thisMonthRange.start.toLocaleString('default', {month: 'long'}),
          'Water Consumption(m3)',
          "Date: $label{br}Consumption: $dataValue");
        break;
      };

      case 2: {
        this.trendLogTabIndex = 2;
        this.getTrendLogs(3,
          this.datePipe.transform(this.thisYearRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.thisYearRange.end, 'yyyy/MM/dd'),
          'Months of ' + this.datePipe.transform(this.thisYearRange.start, 'yyyy'),
          'Water Consumption (m3)',
          "Month: $label{br}Consumption: $dataValue");
        break;
      };

      case 3: {
        this.trendLogTabIndex = 3;
        this.getTrendLogsForYear(4,
          this.datePipe.transform(this.lastFiveYearRange.start, 'yyyy/MM/dd'),
          this.datePipe.transform(this.lastFiveYearRange.end, 'yyyy/MM/dd'),
          'Last 5 Years',
          'Water Consumption (m3)',
          "Year: $label{br}Consumption: $dataValue");
        break;
      }
    }
  }
}
