import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { JuridicoPageComponent } from './juridico-page/juridico-page.component';

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
        component: JuridicoPageComponent,
        children: [
          {
            path: 'cuentasPorCobrar',
            loadChildren: () =>
              import('./jur-cxc-page/jur-cxc-page.module').then(
                (m) => m.JurCxcPageModule
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
            data: { cartera: { clave: 'JUR', descripcion: 'Jurídico' } },
          },
        ],
      },
    ]),
  ],
  declarations: [JuridicoPageComponent],
})
export class FeatureCobranzaJurModule {}
