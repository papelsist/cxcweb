import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

import { finalize, takeUntil, map } from 'rxjs/operators';
import orderBy from 'lodash/orderBy';

import { CxcService } from '@nx-papelsa/shared/cxc/data-acces';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';
import { ReportService } from '@nx-papelsa/shared/utils/ui-forms';

import { Antiguedad } from './antiguedad-models';
import { AnalyticsStateService } from '../services/analytics-state.service';
import { AntiguedadStateService } from '../services/antiguedad-state.service';
import { AntiguedadDialogComponent } from '../reportes/antiguedad-dialog.component';
import { AntiguedadCteDialogComponent } from '../reportes/antiguedad-cte-dialog.component';
import { CarteraCodDialogComponent } from '../reportes/cartera-cod-dialog.component';
import { FacturasConDevDialogComponent } from '../reportes/facturas-con-dev-dialog.component';
import { SucursalPeriodoDialogComponent } from '../reportes/sucursal-periodo-dialog.component';
import { VentasPorClienteComponent } from '../reportes/ventas-por-cliente.component';

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
    private antiguedadService: AntiguedadStateService,
    private dialog: MatDialog,
    private reportService: ReportService,
    private dialogService: TdDialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.totales = this.buildTotalTemplate();
    this.isSidebarVisible$.subscribe((val) => (this.visible = val));
    // this.load();
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
    if (a) {
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
    } else {
      this.facturasPorCliente = [];
    }
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
    // totales.part = 100.0;
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

  reporteDeAntiguedad() {
    this.dialog
      .open(AntiguedadDialogComponent, { data: {} })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log('Ejecutando reporte.....');
          this.reportService.runReport(
            'cuentasPorCobrar/antiguedad/print',
            res
          );
        }
      });
  }

  reporteDeAntiguedadPorCliente() {
    this.dialog
      .open(AntiguedadCteDialogComponent, { data: {}, width: '750px' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport(
            'cuentasPorCobrar/antiguedad/antiguedadPorCliente',
            res
          );
        }
      });
  }

  reporteDeCarteraCOD() {
    this.dialog
      .open(CarteraCodDialogComponent, { data: {} })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport(
            'cuentasPorCobrar/antiguedad/reporteDeCobranzaCOD',
            res
          );
        }
      });
  }
  clientesSuspendidos() {
    this.dialogService
      .openConfirm({
        title: 'Reporte de clientes suspendidos',
        message: 'Ejecutar reporte',
        cancelButton: 'Cancelar',
        acceptButton: 'Ejecutar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport(
            'cuentasPorCobrar/antiguedad/clientesSuspendidosCre',
            res
          );
        }
      });
  }

  facturasConDevolucion() {
    this.dialog
      .open(FacturasConDevDialogComponent, { data: {} })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport(
            'cuentasPorCobrar/antiguedad/facturasConNotaDevolucion',
            res
          );
        }
      });
  }

  excepcionesEnDescuentos() {
    this.dialog
      .open(SucursalPeriodoDialogComponent, {
        data: { titla: 'Excepciones en descuentos' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport(
            'cuentasPorCobrar/antiguedad/reporteExceptionesDescuentos',
            res
          );
        }
      });
  }

  ventasAcumuladas() {
    this.dialog
      .open(SucursalPeriodoDialogComponent, {
        data: { title: 'Ventas acumuladas' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport('ventas/ventasAcumuladas', res);
        }
      });
  }

  ventasPorCliente() {
    this.dialog
      .open(VentasPorClienteComponent, {
        data: {
          title: 'Ventas por cliente',
          origenes: [
            { clave: 'CRE', descripcion: 'CREDITO' },
            { clave: 'CON', descripcion: 'CONTADO' },
            { clave: 'COD', descripcion: 'COD' },
            { clave: '%', descripcion: 'TODOS' },
          ],
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.reportService.runReport('ventas/ventaPorCliente', res);
        }
      });
  }
  ventasPorFacturista() {
    this.dialog
      .open(SucursalPeriodoDialogComponent, {
        data: { title: 'Ventas por facturista' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          // const command = {
          //   ...res,
          //   origen: res.origen === 'TODOS' ? '%' : res.origen,
          // };
          this.reportService.runReport('ventas/ventaPorFacturista', res);
        }
      });
  }
}
