import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@environment';
import { MainComponent } from './components/main/main.component';
import { ParameterDashboardComponent } from './components/parameter-dashboard/parameter-dashboard.component';
import { ParameterDashboardFormComponent } from './components/parameter-dashboard-form/parameter-dashboard-form.component';
import { StartComponent } from './components/start/start.component';
import { PcvModelInsightsComponent } from './components/pcv-model-insights/pcv-model-insights/pcv-model-insights.component';
import { PcvPredictionComponent } from './components/pcv-prediction/pcv-prediction/pcv-prediction.component';

const routes: Routes = [
  { path: '', redirectTo: `${environment.defaultLang}/${environment.defaultChapter}`, pathMatch: 'full' },
  { path: ':lang/:chapter', component: MainComponent, children: [
    { path: '', redirectTo: `start`, pathMatch: 'full' },
    { path: 'start', component: StartComponent },
    { path: 'start/:type/form', component: ParameterDashboardFormComponent },
    { path: ':product/parameter-dashboard', component: ParameterDashboardComponent, pathMatch: 'full' },
    { path: ':product/parameter-dashboard/:type/form', component: ParameterDashboardFormComponent },
    { path: ':product/pcv-model-insights', component: PcvModelInsightsComponent },
    { path: ':product/pcv-prediction', component: PcvPredictionComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
