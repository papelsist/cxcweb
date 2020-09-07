import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { TdDialogService } from '@covalent/core/dialogs';

import { RevisionesFacade } from '@nx-papelsa/shared/cxc/data-access-revisiones';
import { VentaCredito } from '@nx-papelsa/shared/utils/core-models';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';
import { ReportService } from '@nx-papelsa/shared/utils/ui-forms';

import { RevisionFormComponent } from './components/revision-form/revision-form.component';
import { ReporteDeRevisionComponent } from './components';

@Component({
  selector: 'nx-papelsa-revisiones-page',
  templateUrl: './revisiones-page.component.html',
  styleUrls: ['./revisiones-page.component.scss'],
})
export class RevisionesPageComponent extends BaseComponent implements OnInit {
  ventas$: Observable<VentaCredito[]> = this.facade.allRevisiones$;
  loading$ = this.facade.loading$;

  selected$ = this.facade.allSelectedIds$;
  selectedRevisiones$ = this.facade.allSelected$;
  porRecibir$ = this.facade.porRecibir$;
  recibidasCancelables$ = this.facade.recibidasCancelables$;
  porRevisar$ = this.facade.porRevisar$;
  revisadas$ = this.facade.revisadas$;
  ultimaActualizacion$ = this.facade.ultimaActualizacion$;

  constructor(
    public facade: RevisionesFacade,
    private dialogService: TdDialogService,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.facade.loaded$
      .pipe(
        filter((loaded) => !loaded),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.reload();
      });
  }

  reload() {
    this.facade.loadRevisiones();
  }

  filter(event: string) {
    this.facade.setSearchTerm(event);
  }

  onDrillDown(event: VentaCredito) {
    // this.facade.edit(event, cartera);
  }

  onSelection(event: VentaCredito[]) {
    // this._selected$.next(event);
    this.facade.setSelection(event);
  }

  actualizar() {
    this.confirmar(
      'Revisón y cobro',
      'Actualizar y Recalcular cuentas por cobrar'
    ).subscribe(() => this.facade.actualizarRevisiones());
  }

  recepcion(selected: VentaCredito[]) {
    if (selected.length > 0) {
      const facturas = selected.map((item) => item.id);
      this.facade.registrarRecepcion(true, facturas);
    }
  }

  cancelarRecepcion(facturas: string[]) {
    this.facade.registrarRecepcion(false, facturas);
  }

  revisada(selected: VentaCredito[], value: boolean) {
    if (selected.length > 0) {
      const facturas = selected.map((item) => item.id);
      this.facade.registrarRevision(value, facturas);
    }
  }

  cancelarRevisada(selected: VentaCredito[]) {
    if (selected.length > 0) {
      const facturas = selected.map((item) => item.id);
    }
  }

  edit(facturas: VentaCredito[]) {
    const cliente = facturas[0].cliente;
    facturas = facturas.filter((item) => item.cliente === cliente);
    this.dialog
      .open(RevisionFormComponent, { data: { facturas }, width: '700px' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log('Actualizando seleccion con: ', res);
          const command = {
            template: res,
            facturas: facturas.map((item) => item.id),
          };
          this.facade.batchUpdate(command);
        }
      });
  }

  reporte() {
    this.dialog
      .open(ReporteDeRevisionComponent, { data: {} })
      .afterClosed()
      .subscribe((command) => {
        if (command) {
          const url = 'cxc/ventaCredito/print';
          this.reportService.runReport(url, command);
        }
      });
  }

  confirmar(title: string, message: string): Observable<any> {
    return this.dialogService
      .openConfirm({
        title,
        message,
        cancelButton: 'Cancelar',
        acceptButton: 'Aceptar',
      })
      .afterClosed()
      .pipe(filter((res) => res));
  }

  /*
  reporteDeCobranza(cartera: Cartera) {
    const url = 'cxc/cobro/reporteDeCobranza';
    const params = { cartera: cartera.clave };
    const key = `sx.papelsa.cobranza.fecha.${cartera.clave.toLowerCase()}`;
    const pfecha = Periodo.fromStorage(key, Periodo.fromNow(1));
    this.reportService.runReportePorFecha(
      url,
      pfecha.fechaFinal,
      params,
      `Cobranza (${cartera.descripcion})`,
      null,
      (fecha: Date) => {
        const resPer = new Periodo(fecha, fecha);
        Periodo.saveOnStorage(key, resPer);
      }
    );
  }
  */
}
