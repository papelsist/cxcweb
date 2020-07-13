import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreditoPageComponent } from './credito-page/credito-page.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
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
            path: 'devoluciones',
            loadChildren: () =>
              import('@nx-papelsa/shared/cxc/feature-devoluciones').then(
                (m) => m.FeatureDevolucionesModule
              ),
          },
        ],
      },
    ]),
  ],
  declarations: [CreditoPageComponent],
})
export class FeatureCobranzaCreModule {}
