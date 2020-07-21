import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Cfdi } from '@nx-papelsa/shared/utils/core-models';
import { CfdiEnvioDialogComponent } from '../components';

@Injectable({ providedIn: 'root' })
export class CfdiUiService {
  constructor() {}

  sendByEmail(cfdi: Partial<Cfdi>, email: string) {
    // this.dialog
    //   .open(CfdiEnvioDialogComponent, { data: { email } })
    //   .afterClosed()
    //   .subscribe((res) => {
    //     if (res) {
    //       console.log('Enviar CFDI a: ', res);
    //     }
    //   });
  }
}
