import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectorCxcComponent } from './selector-cxc.component';
import {
  CuentaPorCobrar,
  CuentaPorCobrarDTO,
} from '@nx-papelsa/shared/utils/core-models';
import { CxcDialogComponent } from '../../cxc-dialog/cxc-dialog.component';
import { CxcService } from '@nx-papelsa/shared/cxc/data-acces';

@Injectable()
export class SelectorCxcService {
  constructor(private dialog: MatDialog, private service: CxcService) {}

  selectFacturasPendientes(facturas: CuentaPorCobrarDTO[]) {
    return this.dialog.open(SelectorCxcComponent, { data: { facturas } });
  }

  findCuentaPorCobrar() {
    this.dialog
      .open(SelectorCxcComponent, {
        data: { facturas: [], multiple: false },
      })
      .afterClosed()
      .subscribe((selected) => {
        if (selected) {
          console.log('Selected: ', selected[0]);
          this.showFactura(selected[0]);
        }
      });
  }

  showFactura({ id }) {
    this.service.fetch(id).subscribe(
      (cxc) => {
        this.dialog.open(CxcDialogComponent, {
          data: { cxc },
          width: '75%',
          height: '85%',
        });
      },
      (error) => {
        console.error('Error: ', error);
      }
    );
  }
}
