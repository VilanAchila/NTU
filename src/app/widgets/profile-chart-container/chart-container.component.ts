import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DummyDataService} from '../../services/sample/dummy-data.service';
import {DatePipe} from '@angular/common';
import {HttpService} from '../../services/http.service';
import {DateServiceService} from '../../services/date-service.service';
import {ConfigurationService} from '../../services/configuration.service';
import {DateRange} from '../date-range-picker/lib/models/date-range';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss']
})
export class ChartContainerComponent implements OnInit {

  @Input() isCompare: boolean;
  @Input() dataSource: any;
  @Input() chart = null;
  @Input() dataset: any;
  dateRange: DateRange;
  @Output() compareChange = new EventEmitter();
  @Output() dateChangeEvent = new EventEmitter();

  constructor(
    private dummyDataService: DummyDataService,
    private datePipe: DatePipe,
    private dataService: HttpService,
    private dateService: DateServiceService,
    private configs: ConfigurationService
  ) {

  }

  ngOnInit() {
    this.dateRange = this.dateService.getThisMonth(new Date());
    this.dataset = this.configs.chartConfigurations.profileChartData;
    this.chart = this.configs.chartConfigurations["profileChart"];
  }

  onToggleChanged(event){
    this.compareChange.emit(event);
  }

  dateChanged(event){
    this.dateChangeEvent.emit({event:event, isCompare: this.isCompare})
  }
}
