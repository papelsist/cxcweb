import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationRoute, Cliente } from '@nx-papelsa/shared/utils/core-models';
import { ClientesFacade } from '@nx-papelsa/shared/clientes/data-access-clientes';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-clientes-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss'],
})
export class ClienteDashboardComponent extends BaseComponent implements OnInit {
  isSmallScreen$: Observable<boolean>;
  mode$: Observable<'side' | 'over'>;
  cliente$: Observable<Cliente>;

  routes: NavigationRoute[] = [
    {
      path: 'analytics',
      label: 'Analytics',
      description: 'Análisis de cliente',
      icon: 'analytics',
    },
    {
      path: 'info',
      label: 'Generales',
      description: 'Datos generales',
      icon: 'account_box',
    },
    {
      path: 'facturas',
      label: 'Facturas',
      description: 'Cuentas por cobrar',
      icon: 'shopping_cart',
    },
    {
      path: 'creditos',
      label: 'Créditos',
      description: 'Bonificaciones/Devoluciones',
      icon: 'all_inbox',
    },
    {
      path: 'cargos',
      label: 'Cargos',
      description: 'Notas de cargo',
      icon: 'playlist_add',
    },
    {
      path: 'cfdis',
      label: 'Cfdis',
      description: 'Comprobantes fiscales',
      icon: 'code',
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private facade: ClientesFacade
  ) {
    super();
    this.cliente$ = facade.currentCliente$;
  }

  ngOnInit() {
    this.isSmallScreen$ = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(map((brakPoint) => brakPoint.matches));

    this.mode$ = this.isSmallScreen$.pipe(
      map((value) => (value ? 'over' : 'side'))
    );
  }

  estadoDeCuenta() {}
}
