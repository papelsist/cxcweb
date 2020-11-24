import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Cliente,
  ClienteComentario,
  ClienteCredito,
  MedioDeContacto,
} from '@nx-papelsa/shared/utils/core-models';
import { ClientesFacade } from '@nx-papelsa/shared/clientes/data-access-clientes';
import { Update } from '@ngrx/entity';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  cliente$ = this.facade.currentCliente$;
  constructor(
    private facade: ClientesFacade,
    private dialogService: TdDialogService
  ) {}

  ngOnInit(): void {}

  onEditCliente(cliente: Update<Cliente>) {
    this.facade.updateCliente(cliente);
  }

  onEditCredito(cliente: Cliente, credito: Update<ClienteCredito>) {
    this.facade.updateClienteCredito(cliente.id, credito);
  }

  onEditMedio(cliente: Cliente, medio: Update<MedioDeContacto>) {
    this.facade.updateMedioDeContacto(cliente.id, medio);
  }

  onAddMedio(cliente: Cliente, medio: Partial<MedioDeContacto>) {
    this.facade.addMedioDeContacto(cliente.id, medio);
  }
  onDeleteMedio(cliente: Cliente, medio: MedioDeContacto) {
    this.facade.deleteMedioDeContacto(cliente.id, medio);
  }

  onAltaDeCredito(cliente: Cliente) {
    this.dialogService
      .openConfirm({
        title: 'Alta de crédito',
        message: 'Habilitar línea de crédito para: ' + cliente.nombre,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && !cliente.credito) {
          console.log('Registrar linea de credito: ', cliente);

          this.facade.altaDeLineaDeCredito(cliente);
        }
      });
  }

  onAddComentario(cliente: Cliente, comentario: ClienteComentario) {
    this.facade.addComentario(cliente, comentario);
  }

  onDeleteComentario(cliente: Cliente, comentario: ClienteComentario) {
    this.facade.deleteComentario(cliente, comentario);
  }
  onUpdateComentario(cliente: Cliente, comentario: ClienteComentario) {
    this.facade.updateComentario(cliente, comentario);
  }
}
