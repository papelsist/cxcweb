import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ClienteSelectorComponent } from '../components';

@Injectable()
export class ClientesUiService {
  constructor(private dialog: MatDialog) {}

  lookupCliente() {
    this.dialog
      .open(ClienteSelectorComponent, {
        data: { selection: 'single' },
        width: '70%',
        height: '30rem',
      })
      .afterClosed()
      .subscribe((cliente) => {
        console.log('Selection: ', cliente);
      });
  }
}
