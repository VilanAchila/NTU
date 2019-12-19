import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElectricalDashboardComponent } from './dashboards/electrical-dashboard/electrical-dashboard.component';
import { WaterDashboardComponent } from './dashboards/water-dashboard/water-dashboard.component';
import { SiteElectricalDashboardComponent } from './dashboards/site-electrical-dashboard/site-electrical-dashboard.component';
import { SiteWaterDashboardComponent } from './dashboards/site-water-dashboard/site-water-dashboard.component';
import { OverviewComponent } from './dashboards/overview/overview.component';
import { ChillerPlantComponent } from './dashboards/chiller-plant/chiller-plant.component';
import { ImageMapComponent } from './widgets/image-map/image-map.component';
import { ReportsComponent } from './widgets/reports/reports.component';
import { AlertsComponent } from './widgets/alerts/alerts.component';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch : 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'site-electrical', component: SiteElectricalDashboardComponent },
  { path: 'site-water', component: SiteWaterDashboardComponent },
  { path: 'electrical/:id', component: ElectricalDashboardComponent },
  { path: 'water/:id', component: WaterDashboardComponent },
  { path: 'plant', component: ChillerPlantComponent},
  { path: 'map/:type/:building', component: ImageMapComponent },
  { path: 'reports', component: ReportsComponent},
  { path: 'alerts', component: AlertsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
