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
      `Importe: $${cobro.importe}`
    ).subscribe((res) => {
      if (res) {
        this.facade.generarRecibo(cobro);
      }
    });
  }


  onGenerarReciboV4(cobro: Cobro) {
    console.log('Generando el recibo de pago en version 4');
    this.confirm(
      'Generar recibo electrónico de pago',
      `Importe: $${cobro.importe}`
    ).subscribe((res) => {
      if (res) {
        this.facade.generarReciboV4(cobro);
      }
    }); 
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

  onCancelar(cobro: Cobro, motivo: string) {
    this.facade.cancelarRecibo(cobro, motivo);
  }
  cancelarRecibo(cobro: Cobro) {
    const cfdi = cobro.cfdi;
    if (cfdi) {
      this.dialogService
        .openPrompt({
          title: 'Cambio de recibo electrónico de pago CFDI',
          message: 'Motivo del cambio:',
          acceptButton: 'Aceptar',
          cancelButton: 'Cancelar',
        })
        .afterClosed()
        .subscribe((motivo) => {
          if (motivo) {
            this.facade.cancelarRecibo(cobro, motivo);
          }
        });
    }
  }

  isDisabled(cobro: Cobro) {
    return cobro.cfdi || cobro.cierre || cobro.tipo !== 'CRE';
  }
}
