import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-real-time-line',
  templateUrl: './real-time-line.component.html',
  styleUrls: ['./real-time-line.component.scss']
})
export class RealTimeLineComponent implements OnInit {

  @Input() dataSource: object = [];

  @Input() height: number = 100;

  constructor() { }

  ngOnInit() {
  }
}
