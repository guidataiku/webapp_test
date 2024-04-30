import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './components/main/main.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TreeNavigationComponent } from './components/tree-navigation/tree-navigation.component';
import { APP_BASE_HREF } from '@angular/common';
import { ApiInterceptor } from './api.interceptor';
import { RDS_ICON_LOADER_CONFIG, RdsAlertModule, RdsAvatarModule, RdsBadgeModule, RdsButtonModule, RdsCardModule, RdsCheckboxModule, RdsChipsModule, RdsDatepickerModule, RdsDialogModule, RdsDividerModule, RdsFormFieldModule, RdsHeaderModule, RdsIconLoaderConfig, RdsIconsModule, RdsNativeDateModule, RdsProgressBarModule, RdsRadioButtonModule, RdsSearchModule, RdsSidenavModule, RdsStepperModule, RdsTabModule, RdsTableModule, RdsTreeModule } from '@rds/angular-components';
import { ParameterDashboardComponent } from './components/parameter-dashboard/parameter-dashboard.component';
import { ParameterDashboardFormComponent } from './components/parameter-dashboard-form/parameter-dashboard-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from "@angular/cdk/overlay";
import { SelectionTableComponent } from './components/selection-table/selection-table.component';
import { SelectionDateRangeComponent } from './components/selection-date-range/selection-date-range.component';
import { StartComponent } from './components/start/start.component';
import { SelectionTreeTableComponent } from './components/selection-tree-table/selection-tree-table.component';
import { PcvModelInsightsComponent } from './components/pcv-model-insights/pcv-model-insights/pcv-model-insights.component';
import { LottieModule } from 'ngx-lottie';
import { PcvModelTabComponent } from './components/pcv-model-insights/pcv-model-tab/pcv-model-tab.component';
import { PcvModelSelectionBatchesComponent } from './components/pcv-model-insights/pcv-model-selection-batches/pcv-model-selection-batches.component';
import { PcvModelSelectionParametersComponent } from './components/pcv-model-insights/pcv-model-selection-parameters/pcv-model-selection-parameters.component';
import { PcvPredictionChartComponent } from './components/pcv-model-insights/pcv-prediction-chart/pcv-prediction-chart.component';
import { PcvParameterChartComponent } from './components/pcv-model-insights/pcv-parameter-chart/pcv-parameter-chart.component';
import { PcvPredictionComponent } from './components/pcv-prediction/pcv-prediction/pcv-prediction.component';
import { PcvPredictionTabComponent } from './components/pcv-prediction/pcv-prediction-tab/pcv-prediction-tab.component';
import { PcvPredictionSelectionBatchComponent } from './components/pcv-prediction/pcv-prediction-selection-batch/pcv-prediction-selection-batch.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavigationComponent,
    TreeNavigationComponent,
    ParameterDashboardComponent,
    ParameterDashboardFormComponent,
    SelectionTableComponent,
    SelectionTreeTableComponent,
    SelectionDateRangeComponent,
    StartComponent,

    PcvModelInsightsComponent,
    PcvModelTabComponent,
    PcvModelSelectionBatchesComponent,
    PcvModelSelectionParametersComponent,
    PcvPredictionChartComponent,
    PcvParameterChartComponent,

    PcvPredictionComponent,
    PcvPredictionTabComponent,
    PcvPredictionSelectionBatchComponent

  ],
  imports: [
    OverlayModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
    RdsFormFieldModule,
    RdsIconsModule,
    RdsDividerModule,
    RdsHeaderModule,
    RdsAvatarModule,
    RdsSidenavModule,
    RdsBadgeModule,
    RdsStepperModule,
    RdsButtonModule,
    RdsTableModule,
    RdsDialogModule,
    RdsSearchModule,
    RdsCheckboxModule,
    RdsRadioButtonModule,
    RdsNativeDateModule,
    RdsDatepickerModule,
    RdsChipsModule,
    RdsTreeModule,
    LottieModule.forRoot({ player: () => import("lottie-web") }),
    RdsProgressBarModule,
    RdsTabModule,
    RdsDividerModule,
    RdsAlertModule
  ],
  providers: [
    { provide: APP_BASE_HREF , useValue: process.env["BASE_HREF"] },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    {
      provide: RDS_ICON_LOADER_CONFIG,
      useValue: {
        preloadSelected: "all",
      } as RdsIconLoaderConfig
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }




