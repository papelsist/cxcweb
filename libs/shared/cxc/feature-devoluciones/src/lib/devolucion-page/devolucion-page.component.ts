import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Update } from '@ngrx/entity';
import {
  DevolucionesFacade,
  DevolucionesEntity,
} from '@nx-papelsa/shared/cxc/data-access-devoluciones';
import { NotaDeCredito, User } from '@nx-papelsa/shared/utils/core-models';

import {
  BaseComponent,
  FormatService,
} from '@nx-papelsa/shared/utils/ui-common';

import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-devolucion-page',
  templateUrl: './devolucion-page.component.html',
  styleUrls: ['./devolucion-page.component.scss'],
})
export class DevolucionPageComponent extends BaseComponent implements OnInit {
  devolucion$: Observable<DevolucionesEntity>;
  loading$ = this.facade.loading$;

  constructor(
    private facade: DevolucionesFacade,
    private dialogService: TdDialogService,
    private formatService: FormatService
  ) {
    super();
    this.devolucion$ = facade.selectedDevolucion$;
  }

  ngOnInit(): void {}

  onUpdate(devolucion: Update<DevolucionesEntity>) {
    console.log('Actualizar Devolucion: ', devolucion);
    this.facade.update(devolucion);
  }

  onTimbrar(devolucion: NotaDeCredito) {
    this.confirm(
      'Generar comprobante fiscal (CFDI)',
      `Total: $${devolucion.total}`
    ).subscribe((res) => {
      if (res) this.facade.timbrar(devolucion);
    });
  }

  onTimbrarV4(devolucion: NotaDeCredito) {
    console.log('Timbrando CFDI en V4');
    
    this.confirm(
      'Generar comprobante fiscal (CFDI)',
      `Total: $${devolucion.total}`
    ).subscribe((res) => {
      if (res) this.facade.timbrarV4(devolucion);
    });
    
  }

  onCancelar(devolucion: NotaDeCredito, { motivo }) {
    this.facade.cancelar(devolucion, motivo);
  }

  onDelete(devolucion: NotaDeCredito) {
    this.facade.delete(devolucion);
  }

  porAutrizar(devolucion: Partial<NotaDeCredito>) {
    return !devolucion.autorizo && devolucion.total > 0;
  }

  onAutorizar(event: User, devolucion: Partial<NotaDeCredito>) {
    const changes = {
      autorizo: event.nombre,
      autorizoFecha: new Date().toISOString(),
    };
    // this.facade.update({ id: devolucion.id, changes });
  }

  onAplicar(devolucion: NotaDeCredito) {
    if (devolucion.disponible > 0.0) {
      this.confirm(
        'Aplicación automática',
        `Aplicar ${this.formatService.formatCurrency(
          devolucion.disponible
        )} a las facturas registradas en los conceptos? `
      ).subscribe((res) => {
        if (res) this.facade.aplicar(devolucion);
      });
    }
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
}
