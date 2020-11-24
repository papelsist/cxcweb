import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { ClienteSelectorComponent } from '../components';
import { Cliente } from '@nx-papelsa/shared/utils/core-models';
import { Router } from '@angular/router';

@Injectable()
export class ClientesUiService {
  constructor(private dialog: MatDialog, private router: Router) {}

  lookupCliente() {
    this.dialog
      .open(ClienteSelectorComponent, {
        data: { selection: 'single' },
        width: '70%',
        // height: '30rem',
      })
      .afterClosed()
      .subscribe((cliente) => {
        if (cliente) {
          this.router.navigate(['clientes', cliente.id]);
        }
      });
  }
}
