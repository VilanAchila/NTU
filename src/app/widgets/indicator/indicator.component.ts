import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  @Input() oldValue: number;

  @Input() newValue: number;

  @Input() text: string = "N/A";

  @Input() unit: string = "N/A";

  diffValue: number;

  percentile: number;

  isIncreased: boolean;

  realtimeConsumptElecUnit: string;

  constructor() {}


  ngOnChanges(changes: SimpleChanges): void {
    this.diffValue = this.newValue - this.oldValue;
    if(this.diffValue > 0) {
      this.isIncreased = true;
    }
    if(999999<Math.abs(this.diffValue)){
      this.diffValue = this.diffValue / 1000;
      if(this.unit=="kWh"){
        this.unit = "MWh";
      }
    }

    this.diffValue = Math.abs(this.diffValue);
    this.percentile = Math.abs((this.diffValue/this.oldValue) * 100);
  }

  ngOnInit() {}
}
