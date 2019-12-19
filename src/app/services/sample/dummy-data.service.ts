import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  constructor(private http: HttpClient) { }

  getJson(fileName: string): Observable<any> {
    return this.http.get("/assets/data/" + fileName + ".json");
  }
}
