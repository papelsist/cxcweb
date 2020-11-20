import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { DepositosPageComponent } from './depositos-page/depositos-page.component';

// import {DataAccessDepositosModule } from '@nx-papelsa/shared/cxc/data-access-depositos';

@NgModule({
  imports: [
    CommonModule,
    UiFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule.forChild([
      {
        path: '',
        component: DepositosPageComponent,
        children: [
          {
            path: 'pendientes',
            loadChildren: () =>
              import('./pendientes-page/pendientes-page.module').then(
                (m) => m.DepositosPendientesPageModule
              ),
          },
          {
            path: 'autorizados',
            loadChildren: () =>
              import('./autorizados-page/autorizados-page.module').then(
                (m) => m.DepositosAutorizadosPageModule
              ),
          },
          {
            path: '',
            redirectTo: 'pendientes',
            pathMatch: 'full',
          },
        ],
      },
    ]),
  ],
  declarations: [DepositosPageComponent],
})
export class FeatureDepositosModule {}
