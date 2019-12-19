import { Component, OnInit, Input} from '@angular/core';
import { DateRange } from 'src/app/widgets/date-range-picker/public-api';
import {DummyDataService} from '../../services/sample/dummy-data.service';
import {DatePipe} from '@angular/common';
import {HttpService} from '../../services/http.service';
import {DateServiceService} from '../../services/date-service.service';
import {ConfigurationService} from '../../services/configuration.service';
import {Interval} from '../../../enums/intervals';

@Component({
  selector: 'app-profile-chart',
  templateUrl: './profile-chart.component.html',
  styleUrls: ['./profile-chart.component.scss']
})

export class ProfileChartComponent implements OnInit {

  @Input() serviceType: number;
  @Input() buildingId: number;
  compare: boolean = false;
  dateRange: DateRange;
  chart = null;
  dataSource: any;
  compareDataSource: any;
  dataset: any;
  datasetCompare: any;
  week = {"Sunday" : 0, "Monday" :1, "Tuesday" : 2, "Wednesday" : 3, "Thursday" : 4, "Friday" : 5, "Saturday" : 6, "Holiday" : 7};

  constructor(
    private dummyDataService: DummyDataService,
    private datePipe: DatePipe,
    private dataService: HttpService,
    private dateService: DateServiceService,
    private configs: ConfigurationService
  ) {}

  ngOnInit() {
    this.dateRange = this.dateService.getThisMonth(new Date());
    this.dataset = this.configs.chartConfigurations.profileChartData;
    this.datasetCompare = this.configs.chartConfigurations.profileChartData2;
    this.chart = this.configs.chartConfigurations["profileChart"];
    this.getChartData({event: this.dateRange, isCompare: true});
  }

  compareChange(event) {
    this.compare = !this.compare;
    if(this.compare){
      this.getChartData({event: this.dateService.getThisMonth(new Date()), isCompare: false});
    }
  }

  getChartData (event) {
    this.dataService.get(
      this.configs.apiEndPoints["profile-chart"],
      {
        startDate: this.datePipe.transform(event.event.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(event.event.end, 'yyyy/MM/dd'),
        serviceTypeId: this.serviceType,
        interval: Interval.ThirtyMin,
        buildingId: this.buildingId,
        groupId: 4
      }
    ).subscribe(response => {
      if (event.isCompare) {
        this.dataset.forEach((element, i) => {
          this.dataset[i].seriesname = null;
          this.dataset[i].data = null;
        });
        let tmp = [];
        response.forEach((element, i) => {
          tmp[this.week[element.name]] = element;
        });
        tmp.forEach((element, i) => {
          this.dataset[i].seriesname = element.name;
          this.dataset[i].data = element.data;
        });

        this.dataService.get(
          this.configs.apiEndPoints["profile-chart"],
          {
            startDate: this.datePipe.transform(event.event.start, 'yyyy/MM/dd'),
            endDate: this.datePipe.transform(event.event.end, 'yyyy/MM/dd'),
            serviceTypeId: this.serviceType,
            interval: Interval.ThirtyMin,
            buildingId: this.buildingId,
            groupId : 5
          }
          ).subscribe(response => {
          this.dataset[7].seriesname = "Holiday";
          this.dataset[7].data = response[0].data;
        });

        this.dataSource = {
          chart: this.chart,
          categories: this.configs.chartConfigurations.profileChartCategories,
          dataset: this.dataset
        }
      } else {
        this.datasetCompare.forEach((element, i) => {
          this.datasetCompare[i].seriesname = null;
          this.datasetCompare[i].data = null;
        });

        let tmp = [];
        response.forEach((element, i) => {
          tmp[this.week[element.name]] = element;
        });
        tmp.forEach((element, i) => {
          this.datasetCompare[i].seriesname = element.name;
          this.datasetCompare[i].data = element.data;
        });

        this.dataService.get(
          this.configs.apiEndPoints["profile-chart"],
          {
            startDate: this.datePipe.transform(event.event.start, 'yyyy/MM/dd'),
            endDate: this.datePipe.transform(event.event.end, 'yyyy/MM/dd'),
            serviceTypeId: this.serviceType,
            interval: Interval.ThirtyMin,
            buildingId: this.buildingId,
            groupId : 5
          }
        ).subscribe(response => {
          this.datasetCompare[7].seriesname = "Holiday";
          this.datasetCompare[7].data = response[0].data;
        });
        this.compareDataSource = {
          chart: this.chart,
          categories: this.configs.chartConfigurations.profileChartCategories,
          dataset: this.datasetCompare
        }
      }
    });
  }

  dateChanged(event)  {
    this.dateRange = event.event;
    this.getChartData(event);
  }
}
