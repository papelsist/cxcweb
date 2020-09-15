import { NgModule } from '@angular/core';

import { ClienteDashboardComponent } from './cliente-dashboard.component';
import { Route, RouterModule } from '@angular/router';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';
import { ClienteExistsGuard } from '@nx-papelsa/shared/clientes/data-access-clientes';

const routes: Route[] = [
  {
    path: '',
    component: ClienteDashboardComponent,
    canActivate: [ClienteExistsGuard],
    children: [
      {
        path: 'analytics',
        loadChildren: () =>
          import('../analytics/analytics.module').then(
            (m) => m.AnalyticsModule
          ),
      },
      {
        path: 'facturas',
        loadChildren: () =>
          import('../facturas/facturas.module').then((m) => m.FacturasModule),
      },
      {
        path: 'creditos',
        loadChildren: () =>
          import('../creditos/creditos.module').then((m) => m.CreditosModule),
      },
      {
        path: 'cargos',
        loadChildren: () =>
          import('../cargos/cargos.module').then((m) => m.CargosModule),
      },
      {
        path: 'cfdis',
        loadChildren: () =>
          import('../cfdis/cfdis.module').then((m) => m.CfdisModule),
      },
      {
        path: 'info',
        loadChildren: () =>
          import('../info/info.module').then((m) => m.InfoModule),
      },
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'analytics',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    MatExpansionModule,
    MatSidenavModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    RouterModule.forChild(routes),
  ],
  exports: [],
  declarations: [ClienteDashboardComponent],
  providers: [],
})
export class ClienteDashboardModule {}
