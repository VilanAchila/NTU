import { Injectable } from '@angular/core';
import {forkJoin, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentBreakdownDataService {

  constructor() { }

  public requestMeterData(buildings): Observable<any[]> {
    return forkJoin([...buildings]);
  }
}
