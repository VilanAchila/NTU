import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grouped-trend',
  templateUrl: './grouped-trend.component.html',
  styleUrls: ['./grouped-trend.component.scss']
})
export class GroupedTrendComponent implements OnInit {
  @Input() dataSourse: any;

  @Input() height: number = 100;
  
  constructor() { }

  ngOnInit() {
  }
}
