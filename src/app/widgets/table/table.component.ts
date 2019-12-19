import { Component, OnInit, Input } from '@angular/core';
import { Table } from 'src/app/models/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() tableData: any;
  @Input() unit: string;
  @Input() type: number;

  constructor() {
  }

  ngOnInit() {
  }

}
