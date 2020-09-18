import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { AnalyticsStateService } from './services/analytics-state.service';
import { AntiguedadStateService } from './services/antiguedad-state.service';

@NgModule({
  declarations: [AnalyticsPageComponent],
  imports: [
    CommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    MatExpansionModule,
    MatSidenavModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    RouterModule.forChild([
      {
        path: '',
        component: AnalyticsPageComponent,
        children: [
          {
            path: 'antiguedad',
            loadChildren: () =>
              import('./antiguedad-page/antiguedad-page.module').then(
                (m) => m.AntiguedadPageModule
              ),
          },
          {
            path: 'cartera',
            loadChildren: () =>
              import('./dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
          },
          {
            path: '',
            redirectTo: 'antiguedad',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: 'antiguedad',
        pathMatch: 'full',
      },
    ]),
  ],
  providers: [AnalyticsStateService, AntiguedadStateService],
})
export class CxcFeatureAnalyticsModule {}
