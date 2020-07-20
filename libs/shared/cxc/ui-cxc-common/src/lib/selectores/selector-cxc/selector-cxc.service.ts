import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectorCxcComponent } from './selector-cxc.component';
import { CuentaPorCobrarDTO } from '@nx-papelsa/shared/utils/core-models';

@Injectable()
export class SelectorCxcService {
  constructor(private dialog: MatDialog) {}

  selectFacturasPendientes(facturas: CuentaPorCobrarDTO[]) {
    return this.dialog.open(SelectorCxcComponent, { data: { facturas } });
    //.afterClosed();
  }
}
