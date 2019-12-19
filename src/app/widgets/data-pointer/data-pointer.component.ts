import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-data-pointer',
  templateUrl: './data-pointer.component.html',
  styleUrls: ['./data-pointer.component.scss']
})
export class DataPointerComponent implements OnInit {

  @Input() pointerText: string = "N/A";

  @Input() unit: string = "N/A";

  @Input() description: string = "N/A";

  @Input() type: string;

  ngOnChanges(changes: SimpleChanges) {
    if(Number(this.pointerText) > 999999){
      if(this.type === 'kwh'){
        this.pointerText = (Number(this.pointerText)/1000).toString();
        this.unit = "MWh";
      }
    }
  }

round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

  constructor() { }

  ngOnInit() {
    if(Number(this.pointerText) > 999999){
      if(this.unit === 'kwh'){
        this.pointerText = (Number(this.pointerText)/1000).toString();
        this.unit = "MWh";
      }
    }
  }

}
