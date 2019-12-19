import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-doughnut2d',
  templateUrl: './doughnut2d.component.html',
  styleUrls: ['./doughnut2d.component.scss']
})
export class Doughnut2dComponent implements OnInit {

  @Input() dataSource: object = [];

  constructor() {
    // this.dataSource =
  }

  ngOnInit() {
  }
}
