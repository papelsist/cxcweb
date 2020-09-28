import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';

import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';

import { forkJoin, Observable } from 'rxjs';
import { finalize, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { AnalyticsService } from '../../services/analytics.service';
import { VentaCommand, VentaMensual } from '../ventas-models';

import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import round from 'lodash/round';

@Component({
  selector: 'papx-cxc-venta-mensual',
  template: `
    <mat-toolbar>
      <span>Detalle de venta</span>
      <span fxFlex></span>
      <button mat-icon-button matTooltip="Descargar com CSV">
        <mat-icon>get_app</mat-icon>
      </button>
      <button mat-icon-button (click)="load()" matTooltip="Refrescar">
        <mat-icon>refresh</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Parámetros">
        <mat-icon>settings</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [``],
})
export class VentaMensualDetComponent extends BaseComponent implements OnInit {
  isSmallScreen$: Observable<boolean>;
  mode$: Observable<'side' | 'over'>;
  ventas$: VentaMensual[] = [];
  command: VentaCommand;
  origenId;

  constructor(
    private service: AnalyticsService,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    const obs1 = this.route.params;

    const obs2: Observable<VentaCommand> = this.route.queryParamMap.pipe(
      map((mp) => ({
        slice: mp.get('slice'),
        ejercicio: parseInt(mp.get('ejercicio'), 10),
        mes: parseInt(mp.get('mes'), 10),
        tipoDeVenta: mp.get('tipoDeVenta'),
        tipoDeProducto: mp.get('tipoDeProducto'),
      }))
    );

    obs1
      .pipe(
        withLatestFrom(obs2),
        tap(([params, command]) => {
          this.command = command;
          this.origenId = params.id;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.load());
    // .subscribe(([params, command]) => this.load(params.id, command));
  }

  load() {
    console.log('Load Data with: ', this.origenId, this.command);
  }

  onDrill(event: any) {
    const { slice } = this.command;
    console.log('Drill: ', event);
    this.router.navigate(['analytics', 'ventas', 'mensual', event.origenId], {
      queryParams: { ...this.command },
    });
  }
}
