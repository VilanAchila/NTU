import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stackedcolumn3dline',
  templateUrl: './stackedcolumn3dline.component.html',
  styleUrls: ['./stackedcolumn3dline.component.scss']
})
export class Stackedcolumn3dlineComponent implements OnInit {

  @Input() dataSource: object = [];
  
  constructor() { }

  ngOnInit() {
  }
}
