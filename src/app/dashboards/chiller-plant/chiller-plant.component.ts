import { FormulaFrequency } from './../../../enums/FormulaFrequency';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { HttpService } from 'src/app/services/http.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import {HttpClient} from '@angular/common/http';
import {DateServiceService} from '../../services/date-service.service';
import {DatePipe, formatDate} from '@angular/common';
import {element} from 'protractor';
import {InitialService} from '../../services/initial.service';
import { format } from 'url';
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
    heatBalanceDataSource: any = null;
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
     generatePlantEfficencyChartData(value) {
      return [{data:[{value}]}];
    }

    plotPlantEfficencyChart(res){
      this.plantEffieciencyDataSource.pointers = {
        "pointer": [
          {
            "value": res[0].data[0].value
          }
        ]
      };
      this.plantEffieciencyDataSource.chart = this.configs.chartConfigurations['planatefficency'];
      this.plantEffieciencyDataSource.colorrange=this.configs.chartConfigurations["plantefficencyColorRange"];
    }

    getPlantEfficency(){
      this.plotPlantEfficencyChart(this.generatePlantEfficencyChartData(0));
      this.plantEffieciencyDataSource = {};
      this.dataService.get(
        this.configs.apiEndPoints["chiller-endpoint-1"],
        {
          siteId: 1,
          plantId: this.chillerId,
          frequencyId: FormulaFrequency.ThirtyMinute
        }).subscribe(res => {
         if(res==null||res.length==0){
          this.plotPlantEfficencyChart(this.generatePlantEfficencyChartData(0));

         }else{
          this.plotPlantEfficencyChart(res);
         }
        },
        err => {
          this.plotPlantEfficencyChart(this.generatePlantEfficencyChartData(0));
        });
    }

    generateAvgHeatBalanceChartData(startTime,endTime) {
        var t=[{data:[]}];
        var st=new Date();
        st.setHours(0);
        st.setMinutes(0);
        st.setSeconds(0);

        var now=new Date();
        while(now>st){
            let date = new Date(st);
            t[0].data.push({"label": date, "value": null});
            st.setHours(st.getHours() + 1);
        }
        return t;
    }

    plotAvgHeatBalanceChartData(res){
      this.heatBalanceDataSource = {};
      const category = [];
      const data = [];
      res[0].data.forEach(element => {
        const time = this.datePipe.transform(element.label, "H:mm");
        category.push({"label": time});
        data.push({"value": element.value});
      });

      this.heatBalanceDataSource.chart = this.configs.chartConfigurations["plantHeatbalance"];
      this.heatBalanceDataSource.categories = [{"category": category}];
      this.heatBalanceDataSource.dataset = [{"data": data}];
      this.heatBalanceDataSource.chart.plotToolText = "Time: $label{br}Consumption: $dataValue";

    }
    getAvgHeatBalance(){
      this.plotAvgHeatBalanceChartData(this.generateAvgHeatBalanceChartData(null, null));
      this.dataService.get(
        this.configs.apiEndPoints["chiller-endpoint-2"],
        {
          siteId: 1,
          plantId: this.chillerId,
          frequencyId: FormulaFrequency.ThirtyMinute,
          startDate:   this.datePipe.transform(this.dateService.getToday(this.today ).start, "yyyy/M/d"),
          endDate:  this.datePipe.transform(this.dateService.getToday(this.today ).end, "yyyy/M/d"),
        }).subscribe(res => {
            if(res==null||res.length==0){
              this.plotAvgHeatBalanceChartData(this.generateAvgHeatBalanceChartData(null, null));
            }else{
              this.plotAvgHeatBalanceChartData(res);
            }
        },
        err => {
          this.plotAvgHeatBalanceChartData(this.generateAvgHeatBalanceChartData(null, null));
        });
    }
    generatePlantEffeciencyTrendDate(startDate,endDate){
      var result = [{data:[]}];
      for (var i=1; i<8; i++) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          result[0].data.push({"label":  this.datePipe.transform(d,"yyyy/M/d"), "value": null} );
      }
      result[0].data.reverse();
      return result;
    }

    plotPlantEffeciencyTrendDate(res){
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
    }

    getPlantEffeciencyTrend(){
      this.plotPlantEffeciencyTrendDate(this.generatePlantEffeciencyTrendDate(null, null));
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
          if(res==null||res.length==0){
          this.plotPlantEffeciencyTrendDate(this.generatePlantEffeciencyTrendDate(null, null));
        }else{
          this.plotPlantEffeciencyTrendDate(res);
        }
        },
        err => {
          this.plotPlantEffeciencyTrendDate(this.generatePlantEffeciencyTrendDate(null, null));
        });
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
