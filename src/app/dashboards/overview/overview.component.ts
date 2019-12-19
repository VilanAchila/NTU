import {Component, OnInit} from '@angular/core';
import {HeaderService} from 'src/app/services/header.service';
import {HttpService} from 'src/app/services/http.service';
import {ConfigurationService} from 'src/app/services/configuration.service';
import {DatePipe} from '@angular/common';
import {DateServiceService} from 'src/app/services/date-service.service';
import {DateRange} from 'src/app/widgets/date-range-picker/public-api';
import {InitialService} from 'src/app/services/initial.service';
import {ServiceType} from '../../../enums/ServiceType';
import {Interval} from '../../../enums/intervals';
import {GroupBy} from '../../../enums/group-by';
import {DataMode} from '../../../enums/DataMode';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit {

  elecChangeInConsumption: any = {};
  elecOldValue: number;
  elecNewValue: number;
  waterChangeInConsumption: any = {};
  waterOldValue: number;
  waterNewValue: number;
  elecCategoryOverview: any = {};
  realTimeConsumptionElec: any;
  realTimeConsumptionElecUnit: string;
  realTimeConsumptionWater: any;
  today: Date;
  lastTwoMonthRange: DateRange;
  lastSixMonthRange: DateRange;
  thisYearFirstRange: DateRange;

  siteId: number;

  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private configs: ConfigurationService,
    private datePipe: DatePipe,
    private dateHelper: DateServiceService,
    private initialService: InitialService
  ) {

    this.headerService.setBoardLevel(2);

    if (!this.initialService.getDemoConfig().isDemo) {
      this.today = new Date();
    } else {
      this.today = new Date(this.initialService.getDemoConfig().demoDate);
    }

    this.lastTwoMonthRange = this.dateHelper.getTwoMonth(this.today);

    this.lastSixMonthRange = this.dateHelper.getLastSixMonth(this.today);

    this.thisYearFirstRange = this.dateHelper.getThisYear(this.today);

    this.dataService.siteId.subscribe(data => {
      this.siteId = data;
    });

    this.dataService.get(this.configs.apiEndPoints.site, {siteId: 1}).subscribe(data => {
      this.headerService.setItem(data.siteName);
    });
  }

  ngOnInit() {
    this.getEnergyConsumption();
    this.getRealTimeConsumptionWater();
    this.getRealTimeConsumptionElect();

    setInterval(() => {
      this.getRealTimeConsumptionWater();
      this.getRealTimeConsumptionElect();
    }, 1000 * 60 * 30);

    this.getWaterChangeInConsumption();
    this.getElecChangeInConsumption();
  }

  generateChangeInConsumption() {
    var dateNow = new Date();
    var oneMonthsBack = new Date(dateNow.setMonth(dateNow.getMonth() - 1)).toLocaleString('default', {month: 'long'});
    var twoMonthsBack = new Date(dateNow.setMonth(dateNow.getMonth() - 1)).toLocaleString('default', {month: 'long'});
    
    let data = [
      {
        "data": [
          {
              "label": oneMonthsBack,
              "value": null
          },
          {
              "label": twoMonthsBack,
              "value": null
          }
        ]
      }
    ];
    return data;
  }

  plotElecChangeInConsumption(data) {
    let newData = [
      {
        "label": data[0].data[0].label.substring(0,3),
        "value": data[0].data[0].value
      },
      {
        "label": data[0].data[1].label.substring(0,3),
        "value": data[0].data[1].value
      }
    ];
    this.elecChangeInConsumption.data = newData;
    this.elecChangeInConsumption.chart = this.configs.chartConfigurations['site-consumption-mode'];
    this.elecOldValue = data[0].data[0].value;
    this.elecNewValue = data[0].data[1].value;
  }

  plotWaterChangeInConsumption(data) {
    let newData = [
      {
        "label": data[0].data[0].label.substring(0,3),
        "value": data[0].data[0].value
      },
      {
        "label": data[0].data[1].label.substring(0,3),
        "value": data[0].data[1].value
      }
    ];
    this.waterChangeInConsumption.data = newData;
    this.waterChangeInConsumption.chart = this.configs.chartConfigurations['water-change-in-consumption'];
    this.waterOldValue = data[0].data[0].value;
    this.waterNewValue = data[0].data[1].value;
  }

  getElecChangeInConsumption() {
    this.dataService.get(this.configs.apiEndPoints['site-consumption-mode'],
      {
        siteId: 1,
        startDate: this.datePipe.transform(this.lastTwoMonthRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.lastTwoMonthRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.None,
        serviceTypeId: ServiceType.ELECTRICAL,
        interval: Interval.Monthly
      }).subscribe(data => {

        if(data == null || data.length == 0){
         this.plotElecChangeInConsumption(this.generateChangeInConsumption());
        }
        else{
          this.plotElecChangeInConsumption(data);
        }
      },
      err => {
        this.plotElecChangeInConsumption(this.generateChangeInConsumption());
      });
  }

  getWaterChangeInConsumption() {
    this.dataService.get(this.configs.apiEndPoints['site-consumption-mode'],
      {
        siteId: 1,
        startDate: this.datePipe.transform(this.lastTwoMonthRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.lastTwoMonthRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.None,
        serviceTypeId: ServiceType.WATER,
        interval: Interval.Monthly
      }).subscribe(data => {
        if(data == null || data.length == 0){
          this.plotWaterChangeInConsumption(this.generateChangeInConsumption());
         }
         else{
          this.plotWaterChangeInConsumption(data);
         }
      },
      err => {
        this.plotWaterChangeInConsumption(this.generateChangeInConsumption());
      });
  }

  getRealTimeConsumptionElect() {
    this.dataService.get(this.configs.apiEndPoints['site-consumption-data-mode'],
      {
        siteId: 1,
        startDate: this.datePipe.transform(this.thisYearFirstRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.thisYearFirstRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.None,
        serviceTypeId: ServiceType.ELECTRICAL,
        interval: Interval.ThirtyMin,
        dataMode: DataMode.OverallSum
      }).subscribe(data => {
      this.realTimeConsumptionElec = data[0].data[0].value;
      if (9999999 < this.realTimeConsumptionElec) {
        this.realTimeConsumptionElec = this.realTimeConsumptionElec / 1000;
        this.realTimeConsumptionElecUnit = 'MWh';
      } else {
        this.realTimeConsumptionElecUnit = 'kWh';
      }
    });
  }

  getRealTimeConsumptionWater() {
    this.dataService.get(this.configs.apiEndPoints['site-consumption-data-mode'],
      {
        siteId: 1,
        startDate: this.datePipe.transform(this.thisYearFirstRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.thisYearFirstRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.None,
        serviceTypeId: ServiceType.WATER,
        interval: Interval.ThirtyMin,
        dataMode: 1
      }).subscribe(data => {
      this.realTimeConsumptionWater = data[0].data[0].value;
    });
  }

  getEnergyConsumption() {
    this.dataService.get(this.configs.apiEndPoints['site-consumption-data-mode'],
      {
        siteId: 1,
        startDate: this.datePipe.transform(this.lastSixMonthRange.start, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(this.lastSixMonthRange.end, 'yyyy/MM/dd'),
        groupId: GroupBy.BuildingCategory,
        serviceTypeId: ServiceType.ELECTRICAL,
        interval: Interval.Monthly,
        dataMode: DataMode.CategorySum
      }).subscribe(data => {

        let newData = [];

        data.forEach(element => {

          newData.push(
            {
              "name": element.name,
              "data": [
                {
                  "label": element.data[0].label.substring(0,3),
                  "value": element.data[0].value
                },
                {
                  "label": element.data[1].label.substring(0,3),
                  "value": element.data[1].value
                },
                {
                  "label": element.data[2].label.substring(0,3),
                  "value": element.data[2].value
                },
                {
                  "label": element.data[3].label.substring(0,3),
                  "value": element.data[3].value
                },
                {
                  "label": element.data[4].label.substring(0,3),
                  "value": element.data[4].value
                },
                {
                  "label": element.data[5].label.substring(0,3),
                  "value": element.data[5].value
                }
              ]
            },
          )
        });

      const category = [];
      const dataSets = [];
      let total = [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}];
      newData.forEach((element, i) => {
        // tslint:disable-next-line:no-shadowed-variable
        const data = [];
        // tslint:disable-next-line:only-arrow-functions
        element.data.forEach(function(month, key) {
          if (i === 0) {
            category.push(
              {
                label: month.label
              }
            );
          }

          data.push(
            {
              value: month.value
            }
          );
          total[key].value = total[key].value + month.value;
        });
        dataSets.push({
          seriesname: element.name,
          data
        });
      });
      dataSets.push({
        seriesname: 'Total Consumption',
        renderas: 'Line',
        plottooltext: "<small>Month: $label{br}Consumption: $dataValueWh</small>",
        data: total
      });

      this.elecCategoryOverview = {
        chart: this.configs.chartConfigurations['site-elec-cat-overview'],
        categories: [{category}],
        dataset: dataSets
      };
    });
  }
}
