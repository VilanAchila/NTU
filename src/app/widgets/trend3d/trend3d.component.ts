import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trend3d',
  templateUrl: './trend3d.component.html',
  styleUrls: ['./trend3d.component.scss']
})
export class Trend3dComponent implements OnInit {

  @Input() dataSource: object = {};
  
  constructor() { }

  ngOnInit() {
  }

}
