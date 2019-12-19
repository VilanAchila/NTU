import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multi-series',
  templateUrl: './multi-series.component.html',
  styleUrls: ['./multi-series.component.scss']
})
export class MultiSeriesComponent implements OnInit {

  @Input() dataSource: object = [];

  @Input() height: number = 100;
  
  constructor() { }

  ngOnInit() {
  }
}
