import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-linear-scale',
  templateUrl: './linear-scale.component.html',
  styleUrls: ['./linear-scale.component.scss']
})
export class LinearScaleComponent implements OnInit {

  @Input() dataSource: object = {};
  @Input() height: object = {};

  constructor() { }

  ngOnInit() {
  }

}
