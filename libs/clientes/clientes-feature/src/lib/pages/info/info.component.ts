import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Cliente,
  ClienteComentario,
  ClienteContacto,
  ClienteCredito,
  MedioDeContacto,
  User
} from '@nx-papelsa/shared/utils/core-models';
import {
  BaseComponent,
  FormatService,
} from '@nx-papelsa/shared/utils/ui-common';
import { ClientesFacade } from '@nx-papelsa/shared/clientes/data-access-clientes';
import { Update } from '@ngrx/entity';
import { TdDialogService } from '@covalent/core/dialogs';
import { AuthFacade } from '@nx-papelsa/auth';
import { takeUntil} from 'rxjs/operators';

@Component({
  selector: 'nx-papelsa-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent extends BaseComponent implements OnInit {
  cliente$ = this.facade.currentCliente$;
  roleDeAutorizacion = false;
  user: Partial<User>;
  roles$ = this.auth.roles$;
  constructor(
    private facade: ClientesFacade,
    private dialogService: TdDialogService,
    private auth: AuthFacade
  ) {
    super();
  }

  ngOnInit(): void {
    this.auth.roles$.pipe(takeUntil(this.destroy$)).subscribe((roles) => {
      const found = roles.find((item) => item === 'ROLE_COMITE_CXC');
      this.roleDeAutorizacion = !!found;
    });
  }

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

  /** Autorizacion modificaciones de credito */

    onAutorizar(event: User, cliente: Cliente) {
    console.log(`Autorizando modificaciones del cliente ${cliente}`);
    const changes = {
      autorizacion: {
        usuario: event.nombre,
        comentario: 'AUTORIZACION TEST',
        fecha: new Date().toISOString(),
      },
    };
    //this.facade.altaDeLineaDeCredito(cliente);
  }

  /** Termina Autorizacion modificaciones de credito */

  onAddComentario(cliente: Cliente, comentario: ClienteComentario) {
    this.facade.addComentario(cliente, comentario);
  }

  onDeleteComentario(cliente: Cliente, comentario: ClienteComentario) {
    this.facade.deleteComentario(cliente, comentario);
  }
  onUpdateComentario(cliente: Cliente, comentario: ClienteComentario) {
    this.facade.updateComentario(cliente, comentario);
  }

  onAddContacto(cliente: Cliente, contacto: ClienteContacto) {
    contacto.cliente = { id: cliente.id };
    const contactos = [...(cliente.contactos || []), contacto];
    const update: Update<Cliente> = { id: cliente.id, changes: { contactos } };
    this.facade.updateCliente(update);
  }

  onDeleteContacto(cliente: Cliente, contacto: ClienteContacto) {
    const contactos = [...(cliente.contactos || [])].filter(
      (item) => item.id !== contacto.id
    );
    const update: Update<Cliente> = {
      id: cliente.id,
      changes: { contactos },
    };
    this.facade.updateCliente(update);
  }

  onUpdateContacto(cliente: Cliente, contacto: ClienteContacto) {
    contacto.cliente = { id: cliente.id };

    const oldData = [...(cliente.contactos || [])].filter(
      (item) => item.id !== contacto.id
    );
    const update: Update<Cliente> = {
      id: cliente.id,
      changes: { contactos: [...oldData, contacto] },
    };
    this.facade.updateCliente(update);
  }
}
