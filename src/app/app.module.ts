import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as TimeCharts from 'fusioncharts/fusioncharts.timeseries';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.carbon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './widgets/header/header.component';
import { NavigatorComponent } from './widgets/navigator/navigator.component';
import { ElectricalDashboardComponent } from './dashboards/electrical-dashboard/electrical-dashboard.component';
import { WaterDashboardComponent } from './dashboards/water-dashboard/water-dashboard.component';
import { MeterTreeComponent } from './widgets/meter-tree/meter-tree.component';
import { ReportsComponent } from './widgets/reports/reports.component';
import { TrendComponent } from './widgets/trend/trend.component';
import { PieComponent } from './widgets/pie/pie.component';
import { MultiLevelPieComponent } from './widgets/multi-level-pie/multi-level-pie.component';
import { Doughnut2dComponent } from './widgets/doughnut2d/doughnut2d.component';
import { DataPointerComponent } from './widgets/data-pointer/data-pointer.component';
import { SiteElectricalDashboardComponent } from './dashboards/site-electrical-dashboard/site-electrical-dashboard.component';
import { SiteWaterDashboardComponent } from './dashboards/site-water-dashboard/site-water-dashboard.component';
import { ModalComponent } from './widgets/modal/modal.component';
import { TableComponent } from './widgets/table/table.component';
import { SideBarComponent } from './widgets/side-bar/side-bar.component';
import { OverviewComponent } from './dashboards/overview/overview.component';
import { FormsModule } from '@angular/forms';
import { IndicatorComponent } from './widgets/indicator/indicator.component';
import { Trend3dComponent } from './widgets/trend3d/trend3d.component';
import { Stackedcolumn3dlineComponent } from './widgets/stackedcolumn3dline/stackedcolumn3dline.component';
import { ChillerPlantComponent } from './dashboards/chiller-plant/chiller-plant.component';
import { ImageMapComponent } from './widgets/image-map/image-map.component';
import { GroupedTrendComponent } from './widgets/grouped-trend/grouped-trend.component';
import { DateRangePickerModule } from './widgets/date-range-picker/public-api';
import { ProfileChartComponent } from './widgets/profile-chart/profile-chart.component';
import { LinearScaleComponent } from './widgets/linear-scale/linear-scale.component';
import { MultiSeriesComponent } from './widgets/multi-series/multi-series.component';
import { RealTimeLineComponent } from './widgets/real-time-line/real-time-line.component';
import { DatePipe } from '@angular/common';
import { AlertsComponent } from './widgets/alerts/alerts.component';
import { AlertsDashboardComponent } from './dashboards/alerts-dashboard/alerts-dashboard.component';
import { SolarComponent } from './dashboards/solar/solar.component';
import { ReportsDashboardComponent } from './dashboards/reports-dashboard/reports-dashboard.component';
import { ToggleSwitchComponent } from './widgets/toggle-switch/toggle-switch.component';
import { InitialService } from './services/initial.service';
import { Api } from './models/api';
import { ChartContainerComponent } from './widgets/profile-chart-container/chart-container.component';
import { VersionComponent } from './widgets/version/version.component';

FusionChartsModule.fcRoot(FusionCharts, Charts, TimeCharts, FusionTheme, Widgets);
FusionCharts.options['creditLabel'] = false;
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigatorComponent,
    ElectricalDashboardComponent,
    WaterDashboardComponent,
    MeterTreeComponent,
    ReportsComponent,
    TrendComponent,
    PieComponent,
    MultiLevelPieComponent,
    Doughnut2dComponent,
    DataPointerComponent,
    SiteElectricalDashboardComponent,
    SiteWaterDashboardComponent,
    ModalComponent,
    TableComponent,
    SideBarComponent,
    OverviewComponent,
    IndicatorComponent,
    Trend3dComponent,
    Stackedcolumn3dlineComponent,
    ChillerPlantComponent,
    ImageMapComponent,
    GroupedTrendComponent,
    ProfileChartComponent,
    LinearScaleComponent,
    MultiSeriesComponent,
    RealTimeLineComponent,
    AlertsComponent,
    AlertsDashboardComponent,
    SolarComponent,
    ReportsDashboardComponent,
    ToggleSwitchComponent,
    ChartContainerComponent,
    ModalComponent,
    VersionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FusionChartsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    DateRangePickerModule,
  ],
  exports: [

  ],
  providers: [
    Title,
    DatePipe,
    InitialService,
    {
      provide   : APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps      : [InitialService],
      multi     : true
    },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [NavigatorComponent, VersionComponent],
  bootstrap: [AppComponent]
})


export class AppModule { }

export function ConfigLoader(configService: InitialService) {
  return () => configService.load('../assets/configs/app-configs.json');
}
