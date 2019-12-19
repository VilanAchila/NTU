import { FormulaFrequency } from './../../../enums/FormulaFrequency';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { HttpService } from 'src/app/services/http.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import {HttpClient} from '@angular/common/http';
import {DateServiceService} from '../../services/date-service.service';
import {DatePipe} from '@angular/common';
import {element} from 'protractor';
import {InitialService} from '../../services/initial.service';
@Component({
  selector: 'app-chiller-plant',
  templateUrl: './chiller-plant.component.html',
  styleUrls: ['./chiller-plant.component.scss']
})
export class ChillerPlantComponent implements OnInit {
  chillersData: any;
  monthlyChange: boolean;
  chillerId: number = 1;
  today: Date;
  constructor(
    private headerService: HeaderService,
    private dataService: HttpService,
    private dateService: DateServiceService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private initialService: InitialService,
    private configs: ConfigurationService) { }
    tabIndex = 0;
    enegeryConsumptionDataSource: any = {};
    plantEffieciencyDataSource: any = {};
    heatBalanceDataSource: any = {};
    effieciencyTrendDataSource: any = {};
    ngOnInit() {
      this.headerService.setItem("Chiller Plant Overview");
      this.headerService.setBoardLevel(2);
      this.dataService.get(this.configs.apiEndPoints["site-all-chillers"], {siteId: 1}).subscribe(res => {
          this.chillersData = res;
          this.chillerId = res[0].chillerPlantID;
          this.getPlantEfficency();
          this.getAvgHeatBalance();
          this.getPlantEffeciencyTrend();
          this.getEnergyDistribution(true);
        },
        err => {
        });
      if (this.initialService.getDemoConfig().isDemo) {
        this.today = new Date(this.initialService.getDemoConfig().demoDate);
      } else {
        this.today = new Date() ;
      }
    }
    setTabIndex(index: number) {
      this.tabIndex = index;
    }

    getPlantEfficency(){
      this.plantEffieciencyDataSource = {};
      this.dataService.get(
        this.configs.apiEndPoints["chiller-endpoint-1"],
        {
          siteId: 1,
          plantId: this.chillerId,
          frequencyId: FormulaFrequency.ThirtyMinute
        }).subscribe(res => {
          this.plantEffieciencyDataSource.pointers = {
            "pointer": [
              {
                "value": res[0].data[0].value
              }
            ]
          };
          this.plantEffieciencyDataSource.chart = this.configs.chartConfigurations['planatefficency'];
          this.plantEffieciencyDataSource.colorrange=this.configs.chartConfigurations["plantefficencyColorRange"];
        },
        err => {});
    }
    getAvgHeatBalance(){
      this.heatBalanceDataSource = {};
      this.dataService.get(
        this.configs.apiEndPoints["chiller-endpoint-2"],
        {
          siteId: 1,
          plantId: this.chillerId,
          frequencyId: FormulaFrequency.ThirtyMinute,
          startDate:   this.datePipe.transform(this.dateService.getToday(this.today ).start, "yyyy/M/d"),
          endDate:  this.datePipe.transform(this.dateService.getToday(this.today ).end, "yyyy/M/d"),
        }).subscribe(res => {
          const category = [];
          const data = [];
          res[0].data.forEach(element => {
            const time = this.datePipe.transform(element.label, "h:mm:ss a");
            category.push({"label": time});
            data.push({"value": element.value});
          });

          this.heatBalanceDataSource.chart = this.configs.chartConfigurations["plantHeatbalance"];
          this.heatBalanceDataSource.categories = [{"category": category}];
          this.heatBalanceDataSource.dataset = [{"data": data}];
          this.heatBalanceDataSource.chart.plotToolText = "Time: $label{br}Consumption: $dataValue";
        },
        err => {});
    }
    getPlantEffeciencyTrend(){
      this.effieciencyTrendDataSource = {};
      this.dataService.get(
        this.configs.apiEndPoints["chiller-endpoint-4"],
        {
          siteId: 1,
          plantId: this.chillerId,
          frequencyId: FormulaFrequency.Month,
          startDate:  this.datePipe.transform(this.dateService.getLastSevenDays(this.today ).start, "yyyy/M/d"),
          endDate: this.datePipe.transform(this.dateService.getLastSevenDays(this.today ).end, "yyyy/M/d"),
        }).subscribe(res => {
          const category = [];
          const data = [];
          res[0].data.forEach(element => {
            const time = this.datePipe.transform(element.label, "yyyy/M/d");
            category.push({"label": time});
            data.push({"value": element.value});
          });

          this.effieciencyTrendDataSource.chart=this.configs.chartConfigurations["effecenctTrend"];
          this.effieciencyTrendDataSource.chart.plotToolText = "Date: $label{br}Consumption: $dataValue";
          this.effieciencyTrendDataSource.categories = [{"category": category}];
          this.effieciencyTrendDataSource.dataset = [{"data": data}];
        },
        err => {});
    }
    getEnergyDistribution(type){
      let dateRange = null;
      if(type){
        dateRange = this.dateService.getThisFullYear(this.today );
      } else {
        dateRange = this.dateService.getThisMonth(this.today );
      }
      this.enegeryConsumptionDataSource = {};
      this.dataService.get(
        this.configs.apiEndPoints["chiller-endpoint-3"],
        {
          siteId: 1,
          plantId: this.chillerId,
          startDate:   this.datePipe.transform(dateRange.start, "yyyy/M/d"),
          endDate: this.datePipe.transform(dateRange.end, "yyyy/M/d"),
        }).subscribe(res => {
          const data = [];
          let tot = 0;
          res.forEach(element => {
            tot += element.data[0].value;
          });

          res.forEach(element => {
            data.push({"label": element.name, "value": element.data[0].value});
          });

          this.enegeryConsumptionDataSource.chart=this.configs.chartConfigurations["energyDist"];
          this.enegeryConsumptionDataSource.data = data;
          this.enegeryConsumptionDataSource.chart.plotToolText = "Equipment: $label{br}Consumption: $dataValue";
          this.enegeryConsumptionDataSource.chart.defaultCenterLabel = "Total Energy: "+tot+"kWh";
        },
        err => {});
    }

    chillerChanged(event){
      this.getPlantEfficency();
      this.getAvgHeatBalance();
      this.getPlantEffeciencyTrend();
      this.getEnergyDistribution(true);
    }

    monthlyToggle(event){
      this.monthlyChange = event;
      this.getEnergyDistribution(event);
    }
    last7Days () {
      var result = [];
      for (var i=0; i<7; i++) {
        var d = this.today ;
        d.setDate(d.getDate() - i);
        result.push( {label: this.datePipe.transform(d, 'yyyy-MM-dd')} )
      }
      return result.reverse();
    }
}
