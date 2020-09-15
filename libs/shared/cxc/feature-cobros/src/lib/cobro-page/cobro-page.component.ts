import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import {
  Cobro,
  AplicacionDeCobro,
  CuentaPorCobrarDTO,
} from '@nx-papelsa/shared/utils/core-models';
import { CobrosFacade } from '@nx-papelsa/shared/cxc/data-access-cobros';
import {
  FormatService,
  BaseComponent,
} from '@nx-papelsa/shared/utils/ui-common';

import { TdDialogService } from '@covalent/core/dialogs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nx-papelsa-cobro-page',
  templateUrl: './cobro-page.component.html',
  styleUrls: ['./cobro-page.component.scss'],
})
export class CobroPageComponent extends BaseComponent implements OnInit {
  loading$ = this.facade.loading$;
  cobro$ = this.facade.selectedCobros$;
  disabled$ = this.cobro$.pipe(map((cobro) => cobro.cfdi));
  agregarAplicacion$ = this.cobro$.pipe(map((c) => c.saldo >= 0.01));
  timbrable$ = this.cobro$.pipe(
    map((c) => c.requiereRecibo && c.saldo < 0.01 && !c.cfdi)
  );

  constructor(
    private facade: CobrosFacade,
    public service: FormatService,
    private dialogService: TdDialogService,
    private format: FormatService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.disabled$.subscribe((val) => console.log('disabled: ', val));
    this.cobro$
      .pipe(takeUntil(this.destroy$))
      .subscribe((c) => console.log('Atendiendo cobro: ', c));
    // this.timbrable$.subscribe((val) => console.log('Timbrable: ', val));
  }

  onAplicar(cobro: Cobro, facturas: Partial<CuentaPorCobrarDTO>[]) {
    this.facade.aplicar(cobro, facturas);
  }

  onDelete(cobro: Cobro, aplicacion: AplicacionDeCobro) {
    if (!cobro.cfdi) {
      this.confirm(
        'Cobros',
        `Eliminar aplicación de $ ${aplicacion.importe}`
      ).subscribe((res) => {
        if (res) {
          // console.log('Eliminar la aplicación: ', aplicacion);
          this.facade.eliminarAplicacion(cobro, aplicacion);
        }
      });
    }
  }

  onGenerarRecibo(cobro: Cobro) {
    this.confirm(
      'Generar recibo electrónico de pago',
      `Importe: $${cobro.importe}`
    ).subscribe((res) => {
      if (res) {
        this.facade.generarRecibo(cobro);
      }
    });
  }

  onCancelar(cobro: Cobro) {
    if (cobro.cierre) {
      this.dialogService.openAlert({
        title: 'Cancelacion de CFDO',
        message:
          'El cobro ya ha sido cerrado por Contabilidad, no se puede cancelar',
      });
    }
  }

  onSaldar(cobro: Cobro) {
    this.confirm(
      'Saldar disponible',
      `Seguro de saldar:  ${this.format.formatCurrency(cobro.saldo)} (${
        cobro.moneda
      })`
    ).subscribe((res) => {
      if (res) {
        this.facade.saldar(cobro);
      }
    });
  }

  confirm(title: string, message: string): Observable<any> {
    const acceptButton = 'Aceptar';
    const cancelButton = 'Cancelar';
    return this.dialogService
      .openConfirm({
        title,
        message,
        acceptButton,
        cancelButton,
      })
      .afterClosed();
  }

  isDisabled(cobro: Cobro) {
    return cobro.cfdi || cobro.cierre;
  }
}
