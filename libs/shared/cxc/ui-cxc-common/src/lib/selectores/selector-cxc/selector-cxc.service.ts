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
      .subscribe(([selected]) => {
        console.log('Selected: ', selected);
        if (selected) {
          this.showFactura(selected);
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
