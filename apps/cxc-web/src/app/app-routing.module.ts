import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CXCCarteraGuard } from '@nx-papelsa/shared/cxc/data-acces';
import { AuthGuard } from '@nx-papelsa/auth';

const routes: Route[] = [
  {
    path: 'clientes',
    loadChildren: () =>
      import('@nx-papelsa/clientes/clientes-feature').then(
        (m) => m.ClientesFeatureModule
      ),
  },
  {
    path: 'credito',
    loadChildren: () =>
      import('@nx-papelsa/cxc/feature-cobranza-cre').then(
        (m) => m.FeatureCobranzaCreModule
      ),
    data: { cartera: { clave: 'CRE', descripcion: 'CREDITO' } },
    canActivate: [AuthGuard, CXCCarteraGuard],
  },
  {
    path: 'contado',
    loadChildren: () =>
      import('@nx-papelsa/cxc/feature-cobranza-con').then(
        (m) => m.FeatureCobranzaConModule
      ),
    data: { cartera: { clave: 'CON', descripcion: 'CONTADO' } },
    canActivate: [AuthGuard, CXCCarteraGuard],
  },
  {
    path: 'analytics',
    loadChildren: () =>
      import('@nx-papelsa/cxc/feature-analytics').then(
        (m) => m.CxcFeatureAnalyticsModule
      ),
  },
  // {
  //   path: 'analytics',
  //   loadChildren: () =>
  //     import('').then(
  //       (m) => m.CxcFeatureAnalyticsModule
  //     ),
  // },
  {
    path: '',
    redirectTo: 'credito',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
