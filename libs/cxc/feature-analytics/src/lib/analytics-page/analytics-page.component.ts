import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NavigationRoute } from '@nx-papelsa/shared/utils/core-models';

import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';
import { MatDrawer } from '@angular/material/sidenav';
import { AnalyticsStateService } from '../services/analytics-state.service';
import { MatDialog } from '@angular/material/dialog';
import {
  BajaEnVentaDialogComponent,
  MejoresClientesComponent,
} from '../reportes';
import { ReportService } from '@nx-papelsa/shared/utils/ui-forms';
import { VentasPorClienteComponent } from '../reportes/ventas-por-cliente.component';
import { ComparativoMejoresClientesComponent } from '../reportes/comparativo-mejores-clientes.component';
import { VentasPorLineaClienteComponent } from '../reportes/ventas-por-linea-cliente.component';

@Component({
  selector: 'papx-cxc-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  isSmallScreen$: Observable<boolean>;
  mode$: Observable<'side' | 'over'>;

  routes: NavigationRoute[] = [
    {
      path: 'antiguedad',
      label: 'Antigüedad',
      description: 'Antigüedad de Saldos',
      icon: 'multiline_chart',
    },
    {
      path: 'cartera',
      label: 'Cartera',
      description: 'Análisis de cartera',
      icon: 'pie_chart',
    },
    {
      path: 'ventas',
      label: 'Ventas',
      description: 'Análisis de ventas',
      icon: 'bar_chart',
    },
  ];

  reportes = [
    { label: 'Baja en Ventas', handler: () => this.bajasEnVentas() },
    { label: 'Mejores clientes', handler: () => this.mejoresClientes() },
    { label: 'Ventas por Cliente', handler: () => this.ventasPorCliente() },
    { label: 'Clientes sin venta', handler: () => this.clientesSinVentas() },
    {
      label: 'Comparativo mejores clientes',
      handler: () => this.comparativoMejoresClientes(),
    },
    { label: 'Mejores clientes x Línea', name: 'bajaEnVentas' },
    {
      label: 'Ventas clientes x Línea',
      handler: () => this.ventasPorLineaCliente(),
    },
    { label: 'Comparativo Ventas por Línea', name: 'bajaEnVentas' },
    { label: 'Ventas por Línea x Día', name: 'bajaEnVentas' },
    { label: 'Comparativo Vtas por Línea x Cte', name: 'bajaEnVentas' },
  ];

  @ViewChild(MatDrawer, { static: true }) drawer: MatDrawer;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private analyticsService: AnalyticsStateService,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnInit() {
    this.isSmallScreen$ = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(map((brakPoint) => brakPoint.matches));

    this.mode$ = this.isSmallScreen$.pipe(
      map((value) => (value ? 'over' : 'side'))
    );
  }

  ngAfterViewInit(): void {
    this.analyticsService.drawerState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => this.drawer.toggle(val));

    this.drawer.openedChange.subscribe((change: boolean) => {
      this.analyticsService.isDrawerVisible$.next(change);
    });
  }

  bajasEnVentas() {
    this.dialog
      .open(BajaEnVentaDialogComponent, {
        data: { title: 'Reporte de baja en ventas' },
        width: '450px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport('analytics/bajaEnVentas', res);
        }
      });
  }

  mejoresClientes() {
    this.dialog
      .open(MejoresClientesComponent, { width: '450px' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport('analytics/mejoresClientes', res);
        }
      });
  }
  ventasPorCliente() {
    this.dialog
      .open(VentasPorClienteComponent, { width: '750px' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport('analytics/ventasClientesResumen', res);
        }
      });
  }

  clientesSinVentas() {
    this.dialog
      .open(BajaEnVentaDialogComponent, {
        data: { title: 'Reporte de clientes sin venta' },
        width: '450px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport('analytics/clienteSinVentas', res);
        }
      });
  }

  comparativoMejoresClientes() {
    this.dialog
      .open(ComparativoMejoresClientesComponent, {
        data: {},
        width: '450px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport(
            'analytics/comparativoMejoresClientes',
            res
          );
        }
      });
  }

  ventasPorLineaCliente() {
    this.dialog
      .open(VentasPorLineaClienteComponent, {
        data: {},
        width: '750px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport('analytics/ventasPorLineaCliente', res);
        }
      });
  }
}
