import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { JsLoader } from '../../../util/jsLoader';
import MeterTreeConfig from '../../../assets/configs/meter-tree.json';

declare function DrawTree(location, [], {}): any;
@Component({
  selector: 'app-meter-tree',
  templateUrl: './meter-tree.component.html',
  styleUrls: ['./meter-tree.component.scss']
})
export class MeterTreeComponent implements OnInit {

  @Input() dataSource: any = [];
  @Input() configurations: any = null;
  @Input() building: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    let parentNode = {
      name: this.building+"    ",
      consumption: null,
      parent: null,
      children: []
    };
    this.dataSource.forEach(element => {
      if(element.data[0].value !== null){
        parentNode.consumption += element.data[0].value;
      }
      parentNode.children.push({
        name: element.name,
        consumption: element.data[0].value
      });
    });
    this.dataSource = parentNode;
    this.updateChart(this.dataSource, this.configurations);
  }

  ngOnInit() {
    if( this.configurations == null ) {
      this.configurations = MeterTreeConfig;
    }
    JsLoader.loadScript();
  }

  updateChart(res: any[], configs) {
    setTimeout(() => {
      DrawTree(
        '#meter-tree'
        , res
        , configs
      );
    }, 1000);
  }
}
