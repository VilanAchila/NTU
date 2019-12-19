import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { TemplateLiteral } from 'typescript';
import { ConfigurationService } from './configuration.service';
import { InitialService } from './initial.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {


  siteId = new BehaviorSubject<number>(0);

  buildingId = new BehaviorSubject<number>(0);

  serviceTypeId = new BehaviorSubject<number>(0);

  // options = new Option({ withCredentials: true });

  constructor(private http: HttpClient, private configs: ConfigurationService, private initialService: InitialService) { }


  get(url: string, ids: any): Observable<any> {
    let httpParams = new HttpParams({
      siteId: this.siteId.value,
      buildingId: this.buildingId.value,
      serviceTypeId: this.serviceTypeId.value,
      ...ids});

    return this.http.get(this.evalTemplateLiterals(this.initialService.getHost() + "/" + url, {
        siteId: this.siteId.value,
        buildingId: this.buildingId.value,
        serviceTypeId: this.serviceTypeId.value,
        ...ids
      }
    ));
  }

  getRequest(url: string, ids: any) {
    return this.http.get(this.evalTemplateLiterals(this.initialService.getHost() + "/" + url, {
        siteId: this.siteId.value,
        buildingId: this.buildingId.value,
        serviceTypeId: this.serviceTypeId.value,
        ...ids
      }));
  }

  evalTemplateLiterals(string: string, params) {
    return Function(...Object.keys(params), "return `" + string + "`")
      (...Object.values(params));
  }

  setSiteId(siteId: number) {
    this.siteId.next(siteId);
  }

  setbuildingId(buildingId: number) {
    this.buildingId.next(buildingId);
  }

  setserviceTypeId(serviceTypeId: number) {
    this.serviceTypeId.next(serviceTypeId);
  }
}
