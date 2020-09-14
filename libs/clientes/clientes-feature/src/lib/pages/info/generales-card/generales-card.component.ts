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
  Direccion,
} from '@nx-papelsa/shared/utils/core-models';
import { MatDialog } from '@angular/material/dialog';
import { GeneralesFormComponent } from '../generales-form/generales-form.component';
import { Update } from '@ngrx/entity';
import { DireccionDialogComponent } from '@nx-papelsa/shared/utils/ui-forms';

@Component({
  selector: 'nx-papelsa-generales-card',
  templateUrl: './generales-card.component.html',
  styleUrls: ['./generales-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralesCardComponent implements OnInit {
  @Input() cliente: Cliente;
  @Output() edit = new EventEmitter<Update<Cliente>>();
  properties: BeanPropertyListItem<Cliente>[] = [
    {
      name: 'nombre',
      type: 'string',
      label: 'Razón social',
      icon: 'account_circle',
    },
    { name: 'rfc', label: 'RFC', type: 'string', icon: 'info' },
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
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

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

  modificarDireccion(cliente: Cliente) {
    this.dialog
      .open(DireccionDialogComponent, {
        data: { direccion: cliente.direccion },
      })
      .afterClosed()
      .subscribe((direccion: Direccion) => {
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
}
