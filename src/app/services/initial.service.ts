import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InitialService {
  constructor(
    private http: HttpClient,
  ) { }
  private data: any;
  load(url: string) {
    return new Promise((resolve) => {
      this.http.get(url)
        .subscribe(config => {
          this.data = config;
          resolve();
        });
    });
  }

  getHost(): string {
    return this.data.api_host;
  }

  getDemoConfig(): any {
    return {
      isDemo: this.data.demo,
      demoDate: this.data.demoDate,
    };
  }
}
