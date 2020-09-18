import { Component, OnDestroy, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { CxcService } from '@nx-papelsa/shared/cxc/data-acces';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';
import { finalize, takeUntil, map } from 'rxjs/operators';

import orderBy from 'lodash/orderBy';
import { AnalyticsStateService } from '../services/analytics-state.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Antiguedad } from './antiguedad-models';
import { AntiguedadStateService } from '../services/antiguedad-state.service';

@Component({
  selector: 'papx-cxc-antiguedad-page',
  templateUrl: './antiguedad-page.component.html',
  styleUrls: ['./antiguedad-page.component.scss'],
})
export class AntiguedadPageComponent extends BaseComponent
  implements OnInit, OnDestroy {
  registros: any[] = [];
  isSidebarVisible$ = this.analyticsService.isDrawerVisible$;
  visible = true;
  current$ = this.antiguedadService.current$;
  current: Antiguedad;
  totales: Partial<Antiguedad>;
  facturasPorCliente = [];
  searchTerm: string;

  constructor(
    private service: CxcService,
    private loadingService: TdLoadingService,
    private analyticsService: AnalyticsStateService,
    private antiguedadService: AntiguedadStateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.totales = this.buildTotalTemplate();
    this.isSidebarVisible$.subscribe((val) => (this.visible = val));
    this.load();
  }

  load() {
    this.loadingService.register('antiguedad');
    this.service
      .antiguedadDeSaldos()
      .pipe(
        map((rows) => orderBy(rows, 'part', 'desc')),
        finalize(() => this.loadingService.resolve('antiguedad')),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.registros = res;
        this.actualizarTotales();
      });
  }

  cargarFacturas(a: Antiguedad) {
    this.loadingService.register('antiguedad');
    this.service
      .facturasPendientes(a.clienteId)
      .pipe(
        // map((rows) => orderBy(rows, 'part', 'desc')),
        finalize(() => this.loadingService.resolve('antiguedad')),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.facturasPorCliente = res;
      });
  }

  filtrar(term: string) {
    this.searchTerm = term;
  }

  toobleSidebar(val: boolean) {
    // this.isSidebarVisible$.next(val);
    this.analyticsService.toogleDrawer(val);
  }

  onSelection(event: Antiguedad) {
    this.current = event;
    this.antiguedadService.setCurrent(event);
    this.cargarFacturas(event);
  }

  private actualizarTotales() {
    const totales = this.buildTotalTemplate();
    this.registros.forEach((item) => {
      Object.keys(totales).forEach((key) => {
        const v = item[key];
        if (v && typeof v === 'number') {
          totales[key] += v;
        }
      });
    });
    totales.part = 100.0;
    this.totales = { ...totales };
  }

  private buildTotalTemplate() {
    return {
      saldo: 0.0,
      porVencer: 0.0,
      vencido: 0.0,
      de1_30: 0.0,
      de31_60: 0.0,
      de61_90: 0.0,
      mas90: 0.0,
      facturas: 0,
      part: 0.0,
    };
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.antiguedadService.setCurrent(null);
  }
}
