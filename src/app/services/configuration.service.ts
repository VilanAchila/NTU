import { Injectable } from '@angular/core';
import endPoints from 'src/assets/configs/end-points.json';
import configurations from 'src/assets/configs/app-configs.json';
import chartconfigurations from 'src/assets/configs/chart-configs.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  apiEndPoints = endPoints;

  appConfigurations = configurations;

  chartConfigurations = chartconfigurations;

  constructor() { }
}
