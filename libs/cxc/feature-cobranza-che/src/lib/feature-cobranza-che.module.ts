import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { ChequesPageComponent } from './cheques-page/cheques-page.component';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';

@NgModule({
  imports: [
    UiCommonModule,
    UiFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChequesPageComponent,
        children: [
          {
            path: 'facturas',
            loadChildren: () =>
              import('@nx-papelsa/shared/cxc/feature-facturas').then(
                (m) => m.FeatureFacturasModule
              ),
          },
          {
            path: 'cobros',
            loadChildren: () =>
              import('@nx-papelsa/shared/cxc/feature-cobros').then(
                (m) => m.FeatureCobrosModule
              ),
          },
          {
            path: 'bonificaciones',
            loadChildren: () =>
              import('@nx-papelsa/shared/cxc/feature-bonificaciones').then(
                (m) => m.FeatureBonificacionesModule
              ),
          },
          {
            path: 'cargos',
            loadChildren: () =>
              import('@nx-papelsa/shared/cxc/feature-cargos').then(
                (m) => m.FeatureCargosModule
              ),
            data: { cartera: { clave: 'CRE', descripcion: 'Crédito' } },
          },
        ],
      },
    ]),
  ],
  declarations: [ChequesPageComponent],
})
export class FeatureCobranzaCheModule {}
