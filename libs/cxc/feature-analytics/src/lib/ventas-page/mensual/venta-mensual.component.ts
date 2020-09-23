import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';

import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';

import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { AnalyticsService } from '../../services/analytics.service';
import { VentaCommand, VentaMensual } from '../ventas-models';

import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import round from 'lodash/round';

@Component({
  selector: 'papx-cxc-venta-mensual',
  template: `
    <mat-toolbar>
      <span>Venta neta mensual</span>
      <span fxFlex></span>
      <button
        mat-icon-button
        matTooltip="Descargar com CSV"
        (click)="grid.exportData()"
      >
        <mat-icon>get_app</mat-icon>
      </button>
      <button mat-icon-button (click)="reload()" matTooltip="Refrescar">
        <mat-icon>refresh</mat-icon>
      </button>
      <button mat-icon-button (click)="drawer.toggle()" matTooltip="Parámetros">
        <mat-icon>settings</mat-icon>
      </button>
    </mat-toolbar>
    <mat-drawer-container class="container">
      <mat-drawer #drawer [mode]="mode$ | async" [opened]="true" position="end">
        <td-sidesheet>
          <td-sidesheet-header>
            <td-sidesheet-title>Parámetros</td-sidesheet-title>
            <button mat-icon-button td-sidesheet-header-action>
              <mat-icon
                matTooltipPosition="before"
                matTooltip="Ocultar"
                (click)="drawer.toggle()"
                >close</mat-icon
              >
            </button>
          </td-sidesheet-header>
          <td-sidesheet-content>
            <papx-cxc-cube-selector
              #selector
              [command]="command"
              (update)="onUpdateCommand($event)"
            ></papx-cxc-cube-selector>
          </td-sidesheet-content>
          <td-sidesheet-actions>
            <button mat-button color="accent" (click)="selector.submit()">
              <mat-icon>play_arrow</mat-icon>
              <span>Ejecutar</span>
            </button>
          </td-sidesheet-actions>
        </td-sidesheet>
      </mat-drawer>
      <ng-template
        *tdLoading="
          'ventasNetasLoadings';
          type: 'circular';
          mode: 'indeterminate';
          strategy: 'overlay';
          color: 'primary'
        "
      ></ng-template>
      <div class="grid-panel">
        <papx-cxc-venta-grid [rows]="ventas$" #grid></papx-cxc-venta-grid>
      </div>

      <td-chart class="pie-chart">
        <td-chart-tooltip [trigger]="'item'"> </td-chart-tooltip>
        <td-chart-series td-pie [data]="pieChartData$" [radius]="[0, '75%']">
        </td-chart-series>
      </td-chart>
      <papx-cxc-vtas-bar-char
        [data]="ventas$"
        [command]="command"
      ></papx-cxc-vtas-bar-char>
    </mat-drawer-container>
  `,
  styles: [
    `
      .mat-toolbar {
        height: 45px;
      }
      .container {
        flex: 1;
        height: calc(90% - 20px);
      }
      .mat-drawer {
        width: 275px;
        height: 500px;
      }
      .grid-panel {
        height: calc(100% - 20px);
      }

      .pie-chart {
        height: 400px;
      }
      .bar-chart {
        height: 400px;
      }
    `,
  ],
})
export class VentaMensualComponent extends BaseComponent implements OnInit {
  isSmallScreen$: Observable<boolean>;
  mode$: Observable<'side' | 'over'>;
  ventas$: VentaMensual[] = [];
  pieChartData$ = {};
  command: VentaCommand;

  chartSource: any;
  pivotProperty: 'ventaNeta' | 'kilos' | 'importeUtilidad' = 'ventaNeta';
  STORAGE_KEY = 'sx.bi.venta-mensual.command';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private service: AnalyticsService,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService
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

    this.loadParams();
  }

  private loadParams() {
    this.command = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {
      ejercicio: 2020,
      mes: 7,
      tipoDeVenta: 'TODOS',
      tipoDeProducto: 'TODOS',
      slice: 'LINEA',
    };
  }

  onUpdateCommand(event: VentaCommand) {
    this.command = event;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.command));
    this.reload();
  }

  reload() {
    const key = 'ventasNetasLoading';
    this.loadingService.register(key);
    this.service
      .ventasMensuales(this.command)
      .pipe(
        tap((data) => console.log('Data: ', data)),
        finalize(() => this.loadingService.resolve(key))
      )
      .subscribe(
        (res) => {
          const total = sumBy(res, this.pivotProperty);

          res.forEach((item) => {
            item.participacionTipo = this.pivotProperty;
            const current = item[this.pivotProperty];
            if (current && typeof current === 'number') {
              item.participacion = round(current / total, 4);
            }
          });
          this.ventas$ = orderBy(res, [this.pivotProperty], ['desc']);
          this.buildPieChart();
        },
        (error) => this.onError(error)
      );
  }

  private onError(response: any) {
    const message = response.error ? response.error.message : 'Error';
    const message2 = response.message ? response.message : '';
    console.error('API Call error: ', response);
    this.dialogService.openAlert({
      message: `${response.status} ${message} ${message2}`,
      title: `Error ${response.status}`,
      closeButton: 'Cerrar',
    });
  }

  private buildPieChart() {
    let referencia = 0.01;
    if (this.command.slice.toLowerCase() === 'sucursal') {
      referencia = 0.01;
    }
    const otros$ = this.ventas$.filter(
      (item) => item.participacion <= referencia
    );
    const otr = { name: 'Otros', value: sumBy(otros$, this.pivotProperty) };

    const data = this.ventas$
      .filter((item) => item.participacion > referencia)
      .map((item) => ({
        name: item.descripcion,
        value: item[this.pivotProperty],
      }));
    this.pieChartData$ = [otr, ...data].filter((item) => item.value > 0.0);
  }
}
