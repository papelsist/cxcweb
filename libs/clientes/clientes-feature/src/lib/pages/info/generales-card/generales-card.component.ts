import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  BeanPropertyListItem,
  Cliente,
  ClienteComentario,
  ClienteContacto,
  Direccion,
  MedioDeContacto,
} from '@nx-papelsa/shared/utils/core-models';
import { MatDialog } from '@angular/material/dialog';
import { GeneralesFormComponent } from '../generales-form/generales-form.component';
import { Update } from '@ngrx/entity';
import { DireccionDialogComponent } from '@nx-papelsa/shared/utils/ui-forms';
import { TdDialogService } from '@covalent/core/dialogs';
import { ComentarioDialogComponent } from './comentario-dialog.component';
import { CorreoDialogComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-generales-card',
  templateUrl: './generales-card.component.html',
  styleUrls: ['./generales-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralesCardComponent implements OnInit {
  @Input() cliente: Cliente;
  @Output() edit = new EventEmitter<Update<Cliente>>();

  @Output() editTelefono = new EventEmitter<Update<MedioDeContacto>>();
  @Output() addTelefono = new EventEmitter<Partial<MedioDeContacto>>();
  @Output() deleteTelefono = new EventEmitter<Partial<MedioDeContacto>>();

  @Output() editCorreo = new EventEmitter<Update<MedioDeContacto>>();
  @Output() addCorreo = new EventEmitter<Partial<MedioDeContacto>>();
  @Output() deleteCorreo = new EventEmitter<Partial<MedioDeContacto>>();

  @Output() addComentario = new EventEmitter<Partial<ClienteComentario>>();
  @Output() deleteComentario = new EventEmitter<Partial<ClienteComentario>>();
  @Output() updateComentario = new EventEmitter<Update<ClienteComentario>>();

  @Output() addContacto = new EventEmitter<Partial<ClienteContacto>>();
  @Output() deleteContacto = new EventEmitter<Partial<ClienteContacto>>();
  @Output() updateContacto = new EventEmitter<Update<ClienteContacto>>();

  telefonos: MedioDeContacto[] = [];
  comentarios: ClienteComentario[] = [];

  properties: BeanPropertyListItem<Cliente>[] = [
    {
      name: 'nombre',
      type: 'string',
      label: 'Nombre',
      icon: 'account_circle',
    },
    { name: 'rfc', label: 'RFC', type: 'string', icon: 'info' },
    {
      name: 'razonSocial',
      type: 'string',
      label: 'Razón social',
      icon: 'account_circle',
    },
    {
      name: 'regimenFiscal',
      type: 'string',
      label: 'Regimen Fiscal',
      icon: 'account_circle',
    },
    {
      name: 'cfdiMail',
      label: 'CFDI Mail',
      type: 'string',
      icon: 'forward_to_inbox',
    },
    {
      name: 'activo',
      label: 'Status',
      type: 'boolean',
      icon: 'toggle_on',
      valueFormatter: (value) => (value ? 'ACTIVO' : 'SUSPENDIDO'),
      className: (v) => (!v ? 'text-warn' : ''),
    },
    {
      name: 'permiteCheque',
      label: 'Se le recibe  cheque',
      type: 'boolean',
      icon: 'account_balance_wallet',
      valueFormatter: (v) => (v ? 'SI' : 'NO'),
    },
    {
      name: 'chequeDevuelto',
      label: 'Cheques devueltos',
      type: 'number',
      icon: 'report',
    },
    {
      name: 'formaDePago',
      label: 'Forma de pago',
      type: 'string',
      icon: 'payment',
    },
  ];
  constructor(
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    console.log('Cliente: ', this.cliente);
  }

  editar(cliente: Cliente) {
    this.dialog
      .open(GeneralesFormComponent, {
        data: { cliente },
      })
      .afterClosed()
      .subscribe((res: Update<Cliente>) => {
        if (res) {
          this.edit.emit(res);
        }
      });
  }

  modificarDireccion(cliente: Cliente, direccion: Direccion) {
    console.log('Modificando direccion: ', cliente);
    this.dialog
      .open(DireccionDialogComponent, {
        data: { direccion },
      })
      .afterClosed()
      .subscribe(( direccion : Direccion) => {
        if (direccion) {
          const update = { id: cliente.id, changes: { direccion } };
          this.edit.emit(update);
        }
      });
  }

  getClassForItem(item: BeanPropertyListItem<Cliente>, cliente: Cliente) {
    if (item.className) {
      if (typeof item.className === 'function') {
        return item.className(cliente[item.name]);
      } else {
        return item.className;
      }
    }
    return '';
  }

  onEditarTelefono(medio: Update<MedioDeContacto>) {
    this.editTelefono.emit(medio);
  }

  onDeleteTelefono(medio: MedioDeContacto) {
    this.deleteTelefono.emit(medio);
  }

  onAddCorreo() {
    this.dialog
      .open(CorreoDialogComponent, {
        data: {
          title: 'Agregar correo electrónico',
        },
      })
      .afterClosed()
      .subscribe((email) => {
        if (email) {
          const medio: Partial<MedioDeContacto> = {
            descripcion: email,
            tipo: 'MAIL',
          };
          this.addTelefono.emit(medio);
        }
      });
    /*
    this.dialogService
      .openPrompt({
        title: 'Agregar correo electrónico',
        message: 'Email:',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const medio: Partial<MedioDeContacto> = {
            descripcion: res,
            tipo: 'MAIL',
          };
          this.addTelefono.emit(medio);
        }
      });
      */
  }

  onEditarCorreo(medio: Update<MedioDeContacto>) {
    this.editCorreo.emit(medio);
  }

  onDeleteCorreo(medio: MedioDeContacto) {
    this.deleteCorreo.emit(medio);
  }

  onAddTelefono() {
    this.dialogService
      .openPrompt({
        title: 'Agregar teléfono',
        message: 'Número:',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const medio: Partial<MedioDeContacto> = {
            descripcion: res,
            tipo: 'TEL',
          };
          this.addTelefono.emit(medio);
        }
      });
  }

  onAddComentario(comentario: ClienteComentario) {
    this.addComentario.emit(comentario);
  }

  onDeleteComentario(comentario: ClienteComentario) {
    this.deleteComentario.emit(comentario);
  }

  onUpdateComentario(comentario: Update<ClienteComentario>) {
    this.updateComentario.emit(comentario);
  }

  onAddContacto(contacto: ClienteContacto) {
    this.addContacto.emit(contacto);
  }

  onDeleteContacto(contacto: ClienteContacto) {
    this.deleteContacto.emit(contacto);
  }

  onUpdateContacto(contacto: Update<ClienteContacto>) {
    this.updateContacto.emit(contacto);
  }
}
