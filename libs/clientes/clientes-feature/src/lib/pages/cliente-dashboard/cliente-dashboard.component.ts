import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationRoute, Cliente } from '@nx-papelsa/shared/utils/core-models';
import { ClientesFacade } from '@nx-papelsa/shared/clientes/data-access-clientes';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';
import { ReportService } from '@nx-papelsa/shared/utils/ui-forms';
import { MatDialog } from '@angular/material/dialog';
import { EstadoDeCuentaDialogComponent } from '../../components/estado-de-cuenta/estadoDeCuenta-dialog.component';

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
      path: 'cobros',
      label: 'Cobros',
      description: 'Registro de cobros',
      icon: 'playlist_add',
    },
    {
      path: 'cfdis',
      label: 'Cfdis',
      description: 'Comprobantes fiscales',
      icon: 'code',
    },
    {
      path: 'analytics',
      label: 'Analytics',
      description: 'Análisis de cliente',
      icon: 'analytics',
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private facade: ClientesFacade,
    private reportService: ReportService,
    private dialog: MatDialog
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

  estadoDeCuenta(cliente: Cliente) {
    const dialog = this.dialog.open(EstadoDeCuentaDialogComponent, {
      data: {
        cliente,
        fecha: new Date(),
      },
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        console.log('Res: ', res);
        const { cartera, fecha } = res;
        const url = `clientes/estadoDeCuenta`;
        const params = {
          cliente: cliente.id,
          fecha,
          cartera,
        };
        this.reportService.runReport(url, params);
      }
    });
  }
}
