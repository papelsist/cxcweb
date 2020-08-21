import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BonificacionesEntity,
  BonificacionesFacade,
} from '@nx-papelsa/shared/cxc/data-access-bonificaciones';
import { NotaDeCredito, User } from '@nx-papelsa/shared/utils/core-models';
import { Update } from '@ngrx/entity';
import {
  BaseComponent,
  FormatService,
} from '@nx-papelsa/shared/utils/ui-common';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-bonificacion-page',
  templateUrl: './bonificacion-page.component.html',
  styleUrls: ['./bonificacion-page.component.scss'],
})
export class BonificacionPageComponent extends BaseComponent implements OnInit {
  bonificacion$: Observable<BonificacionesEntity>;
  loading$ = this.facade.loading$;

  constructor(
    private facade: BonificacionesFacade,
    private dialogService: TdDialogService,
    private formatService: FormatService
  ) {
    super();
    this.bonificacion$ = facade.selectedBonificacion$;
  }

  ngOnInit(): void {}

  onUpdate(bonificacion: Update<BonificacionesEntity>) {
    console.log('Actualizar Bonificacion: ', bonificacion);
    this.facade.update(bonificacion);
  }

  onTimbrar(bonificacion: Partial<NotaDeCredito>) {
    this.confirm(
      'Generar comprobante fiscal (CFDI)',
      `Total: $${bonificacion.total}`
    ).subscribe((res) => {
      if (res) this.facade.timbrar(bonificacion);
    });
  }

  onCancelar(bonificacion: Partial<NotaDeCredito>, { motivo }) {
    this.facade.cancelar(bonificacion, motivo);
  }

  onDelete(bonificacion: Partial<NotaDeCredito>) {
    this.facade.delete(bonificacion);
  }

  porAutrizar(bonificacion: Partial<NotaDeCredito>) {
    return !bonificacion.autorizo && bonificacion.total > 0;
  }

  onAutorizar(event: User, bonificacion: Partial<NotaDeCredito>) {
    const changes = {
      autorizo: event.nombre,
      autorizoFecha: new Date().toISOString(),
    };
    this.facade.update({ id: bonificacion.id, changes });
  }

  onAplicar(bonificacion: Partial<NotaDeCredito>) {
    if (bonificacion.disponible > 0.0) {
      this.confirm(
        'Aplicación automática',
        `Aplicar ${this.formatService.formatCurrency(
          bonificacion.disponible
        )} a las facturas registradas en los conceptos? `
      ).subscribe((res) => {
        if (res) this.facade.aplicar(bonificacion);
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
