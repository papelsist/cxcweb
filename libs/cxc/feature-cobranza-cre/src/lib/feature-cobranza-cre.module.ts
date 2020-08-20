import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreditoPageComponent } from './credito-page/credito-page.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

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
        component: CreditoPageComponent,
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
            path: 'devoluciones',
            loadChildren: () =>
              import('@nx-papelsa/shared/cxc/feature-devoluciones').then(
                (m) => m.FeatureDevolucionesModule
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
  declarations: [CreditoPageComponent],
})
export class FeatureCobranzaCreModule {}
